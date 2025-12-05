const express = require('express');
const argon2 = require('argon2');
const pool = require('../db');

const router = express.Router();

// Dummy hash for timing resistance
const DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=1$Kt9gWh9Nrz/pehWhPL+vJw$eqaeMRPLl/f8KGGlSsBYY5kt6hlCCXAJw5X6CcFmqas";

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

// REGISTER
router.post('/register', async (req, res) => {
    const {email, password, name} = req.body || {};

    // input validation
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Name, email and password are required",
        });
    }
    if (password.length < 10) {
        return res.status(400).json({
            message: "Password must be at least 10 characters long",
        });
    }

    try {
        // check if email exists
        const [exists] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (exists.length > 0) {
            // generic message to reduce enumeration
            return res.status(409).json({
                message: "Invalid credentials",
            });
        }

        // hash the password
        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });

        // create user as customer
        const [result] = await pool.query(
            "INSERT INTO users (email, password_hash, name, role, failed_logins, lock_until) VALUES (?,?,?, 'customer', 0, NULL)",
            [email, hash, name] // IMPORTANT: store hash, not plaintext
        );

        // log security event
        await logSecurityEvent(req, result.insertId, "REGISTER", "New user registered");

        return res.status(201).json({
            message: "Registered successfully",
        });
    } catch (error) {
        console.error("Error registering: ", error);
        return res.status(500).json({
            message: "Registration failed",
        });
    }
});

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

// LOGIN
router.post('/login', async (req, res) => {
    const {email, password} = req.body || {};

    // form validation
    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        // look up user by email
        const [rows] = await pool.query(
            "SELECT id, email, password_hash, name, role, failed_logins, lock_until FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        const user = rows[0] || null;

        // check for lockout only if user exists
        if (user && user.lock_until && user.lock_until > new Date()) {
            await logSecurityEvent(req, user.id, "LOGIN_LOCKED", "Account locked");
            return res.status(403).json({
                message:
                    `Your account is temporarily locked due to too many failed login attempts. Please try again in ${LOCKOUT_MINUTES}.`,
            });
        }

        // choose which hash to verify
        const hashToVerify = user ? user.password_hash : DUMMY_HASH;

        // always call argon2.verify to prevent timing attacks
        let passwordVerified = false;
        try {
            passwordVerified = await argon2.verify(hashToVerify, password);
        } catch (err) {
            console.error("argon2.verify failed:", err);
            // treat as invalid credentials rather than leaking info
            passwordVerified = false;
        }

        // Handle failure cases
        if (!user || !passwordVerified) {
            if (user) {
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
            } else {
                // unknown email – log with null userId
                await logSecurityEvent(req, null, "LOGIN_FAIL", "Unknown email");
            }

            return res.status(401).json({message: "Invalid credentials"});
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

// LOGOUT
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
