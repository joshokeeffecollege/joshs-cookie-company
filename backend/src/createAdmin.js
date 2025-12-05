const argon2 = require("argon2");
const pool = require("./db");

async function createAdmin() {
    const [rows] = await pool.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        ["admin@cookies.com"]
    );

    // if admin already exists
    if (rows.length > 0) {
        return;
    }

    // create the password hash from plaintext
    const plaintext = process.env.ADMIN_PASSWORD;
    const hash = await argon2.hash(plaintext, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });

    await pool.query(
        "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
        ["admin@cookies.com", hash, "Admin", "admin"]
    );

    console.log(`Successfully created Admin`);
}

module.exports = {createAdmin};