const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET all cookies
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cookies');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching cookies', err);
        res.status(500).json({message: 'DB error'});
    }
});

module.exports = router;
