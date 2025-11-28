const express = require("express");
const pool = require("../db");

const router = express.Router();

// INSECURE REGISTER: plaintext passwords, no validation
router.post("/register", async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, password, role || "customer"]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            role: role || "customer",
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({message: "Error creating user (insecure demo)."});
    }
});

// INSECURE LOGIN: vulnerable to SQL injection
router.post("/login", async (req, res) => {
    const {email, password} = req.body || {};

    try {
        if (email == null || password == null) {
            return res.status(400).json({
                message: "Email and password are required (insecure demo).",
            });
        }

        const sql =
            "SELECT * FROM users " +
            "WHERE email = '" + email + "' " +
            "AND password = '" + password + "' " +
            "LIMIT 1";

        console.log("LOGIN SQL:", sql);

        const [rows] = await pool.query(sql);

        if (rows.length === 0) {
            return res.status(401).json({message: "Invalid credentials."});
        }

        const user = rows[0];

        res.json({
            message: "Login successful (insecure demo).",
            user,
        });
    } catch (err) {
        console.error("Login error (insecure):", err);
        res.status(500).json({
            message: "Error logging in.",
            error: err.message,
        });
    }
});


module.exports = router;
