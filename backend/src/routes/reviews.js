const express = require('express');
const pool = require('../db');

const router = express.Router();

// require user to be logged in to post reviews
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'You must be logged in to submit a review' });
    }
    next();
}

// get reviews
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, author, content, created_at FROM reviews ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
});

// post review
router.post('/', requireAuth, async (req, res) => {
    const { content } = req.body || {};

    if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Review content cannot be empty' });
    }

    const trimmed = content.trim();
    const user = req.session.user;
    const author = user.name || user.email || "Anonymous";

    try {
        const [result] = await pool.query(
            "INSERT INTO reviews (author, content) VALUES (?, ?)",
            [author, trimmed]
        );

        const [rows] = await pool.query(
            "SELECT id, author, content, created_at FROM reviews WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Review created successfully",
            review: rows[0],
        });
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).json({ message: "Error creating review" });
    }
});

module.exports = router;
