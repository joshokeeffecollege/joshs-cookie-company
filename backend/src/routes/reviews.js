const express = require('express');
const pool = require('../db');

const router = express.Router();

// INSECURE - get all reviews
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, author, content, created_at FROM reviews ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
});

// create a review
router.post('/', async (req, res) => {
    const {author, content} = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO reviews (author, content) VALUES (?, ?)",
            [author || "Anonymous", content || ""]
        );

        const [rows] = await pool.query(
            "SELECT id, author, content, created_at FROM reviews WHERE author = ?",
            [result.insertId]
        );
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;