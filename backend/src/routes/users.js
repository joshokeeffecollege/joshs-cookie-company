// routes/users.js (SECURE VERSION)
const express = require('express');
const pool = require('../db');

const router = express.Router();

// require login
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({message: 'Not authenticated'});
    }
    return next();
}

// require admin role
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({message: 'Forbidden: admin access required'});
    }
    return next();
}

// admin only, sanitised fields
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        // IMPORTANT: no password_hash, failed_logins, lock_until in the response
        const [rows] = await pool.query(
            'SELECT id, email, name, role FROM users ORDER BY id ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({message: 'Error fetching users'});
    }
});

module.exports = router;
