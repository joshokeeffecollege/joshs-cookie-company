require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require("helmet");

const pool = require('./db');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const reviewsRouter = require('./routes/reviews');
const { createAdmin } = require("./admin");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    name: "cookie_app_sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true when using https
        maxAge: 1000 * 60 * 60, // 1 hour
    },
}));

app.use(express.json());
app.use(helmet());

// Routers
app.use('/api/users', usersRouter);
app.use('/api', authRouter);
app.use('/api/reviews', reviewsRouter);

// get cookie data
app.get('/api/cookies', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cookies");
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching cookies' });
    }
});

app.get("/api/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Not authorized");
    }
    return res.json({ user: req.session.user });
});

// when the sever starts, an admin is automatically created, if one doesn't exist
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await createAdmin();
    console.log(`Backend API listening on http://localhost:${PORT}`);
});