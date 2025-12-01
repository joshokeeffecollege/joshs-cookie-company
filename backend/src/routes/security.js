// routes/security.js
const express = require('express');
const pool = require('../db');

const router = express.Router();

// Require login
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({message: 'Not authenticated'});
    }
    return next();
}

// Require admin role
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({message: 'Forbidden: admin access required'});
    }
    return next();
}

// GET /api/security/logs - admin-only security log view
router.get('/logs', requireAuth, requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT l.id,
                    l.user_id,
                    u.email AS user_email,
                    u.name  AS user_name,
                    l.event_type,
                    l.ip_address,
                    l.user_agent,
                    l.details,
                    l.created_at
             FROM security_logs l
                      LEFT JOIN users u ON l.user_id = u.id
             ORDER BY l.created_at DESC
             LIMIT 500`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching security logs', error);
        res.status(500).json({message: 'Error fetching security logs'});
    }
});

module.exports = router;
