const express = require('express');
const argon2 = require('argon2');
const pool = require('../db');

const router = express.Router();

// function to log security events
async function logSecurityEvent(req, userId, eventType, details) {
    try {
        await pool.query(
            "INSERT INTO security_logs (user_id, event_type, ip_address, user_agent, details) VALUES (?,?,?,?,?)",
            [
                userId || null,
                eventType,
                req.ip || null,
                req.headers["user-agent"] || null,
                details || null,
            ]
        );
    } catch (error) {
        console.error("Error logging security event:", error);
    }
}

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    // form validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // look up user by email
        const [rows] = await pool.query(
            "SELECT id, email, password_hash, name, role, failed_logins, lock_until FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        console.log("Login lookup:", rows);

        const user = rows[0];

        // If user not found, just fail
        if (!user) {
            await logSecurityEvent(req, null, "LOGIN_FAIL", "Unknown email");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // check for lockout
        if (user.lock_until && user.lock_until > new Date()) {
            await logSecurityEvent(req, user.id, "LOGIN_LOCKED", "Account locked");
            return res.status(403).json({
                message:
                    "Account temporarily locked due to too many failed login attempts. Please try again later.",
            });
        }

        // verify password
        let passwordVerified = false;
        try {
            passwordVerified = await argon2.verify(user.password_hash, password);
        } catch (err) {
            console.error("argon2.verify failed:", err);
            return res.status(500).json({
                message: "Password hash is invalid. Check how the user was created.",
            });
        }

        if (!passwordVerified) {
            const failed = (user.failed_logins || 0) + 1;
            let lock_until = null;

            // if max login fails reached, lock account for LOCKOUT_MINUTES
            if (failed >= MAX_FAILED_LOGINS) {
                lock_until = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
            }

            // update failed logins and lock_until
            await pool.query(
                "UPDATE users SET failed_logins = ?, lock_until = ? WHERE id = ?",
                [failed, lock_until, user.id]
            );

            await logSecurityEvent(req, user.id, "LOGIN_FAIL", "Invalid credentials");

            return res.status(401).json({ message: "Invalid credentials" });
        }

        // successful login: reset failed logins and lock
        await pool.query(
            "UPDATE users SET failed_logins = 0, lock_until = NULL WHERE id = ?",
            [user.id]
        );

        // create new session token to prevent session fixation
        req.session.regenerate(err => {
            if (err) {
                console.error("Session regeneration error: ", err);
                return res.status(500).json({
                    message: "Login failed, please try again",
                });
            }

            // store minimal information in session
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };

            // log the successful login
            logSecurityEvent(req, user.id, "LOGIN_SUCCESS", "User logged in");

            // return sanitized user info to React
            return res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        });
    } catch (error) {
        console.error("Error in /login handler:", error);
        return res.status(500).json({
            message: "Login failed, please try again",
        });
    }
});

// logout
router.post('/logout', async (req, res) => {
    if (!req.session) {
        return res.json({
            message: "Logged out",
        });
    }

    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session: ", err);
            return res.status(500).json({
                message: "Error during logout",
            });
        }
        // keep this name in sync with session cookie name in index.js
        res.clearCookie("cookie_app_sid");
        return res.json({
            message: "Logout successful",
        });
    });
});

module.exports = router;
