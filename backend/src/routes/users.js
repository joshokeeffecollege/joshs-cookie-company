const express = require('express');
const pool = require('../db');

const router = express.Router();

// INSECURE: no authentication, exposes everything
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({message: 'Error fetching users'});
    }
});

module.exports = router;
