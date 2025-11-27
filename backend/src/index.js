const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const cookiesRouter = require("./routes/cookies");

const app = express();

app.use(cors());
app.use(express.json());

// Insecure users endpoint
app.use('/api/users', usersRouter);

app.use('/api', authRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend API listening on http://localhost:${PORT}`);
});
