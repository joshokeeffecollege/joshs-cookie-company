const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const usersRouter = require('./routes/users'); // import routes

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: "Josh's Cookie Company API running"});
});

// mount /api/users
app.use('/api/users', usersRouter);

const cookiesRouter = require('./routes/cookies');
app.use('/api/cookies', cookiesRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend API listening on http://localhost:${PORT}`);
});
