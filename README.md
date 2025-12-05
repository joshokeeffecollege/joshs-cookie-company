# **Installation & Setup**
## **Backend Setup**

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create `.env` file (ignored in Git)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=josh_cookie_company_secure
```

### 3. Start the Backend

```bash
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

---

## 🎨 **Frontend Setup**

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Vite

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# **Database Setup**

### 1. Create the MySQL database

```sql
-- Create separate DB for secure version
CREATE DATABASE joshs_cookie_company_secure
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE joshs_cookie_company_secure;
```

### 2. Create `users` table

```sql
CREATE TABLE users
(
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255)               NOT NULL,
    -- no more plaintext passwords
    password_hash VARCHAR(255)               NOT NULL,
    name          VARCHAR(255)               NOT NULL,
    role          ENUM ('customer', 'admin') NOT NULL DEFAULT 'customer',

    -- Brute-force / lockout support
    failed_logins INT UNSIGNED               NOT NULL DEFAULT 0,
    lock_until    DATETIME                   NULL,

    -- timestamps for auditability
    created_at    TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- prevent duplicate accounts with same email
    CONSTRAINT uq_users_email UNIQUE (email)
);
```

### 3. Create `cookies` table

```sql
CREATE TABLE cookies
(
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)  NOT NULL,
    price       DECIMAL(7, 2) NOT NULL CHECK (price >= 0),
    tag         VARCHAR(100) NULL,
    description TEXT NULL,
    image_url   VARCHAR(255) NULL,

    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_cookies_tag ON cookies (tag);
CREATE INDEX idx_cookies_name ON cookies (name);
```

### 4. Insert cookie data

```sql
INSERT INTO cookies (name, price, tag, description, image_url)
VALUES ('Classic Chocolate Chip', 2.50, 'Best seller',
        'Crispy edges, gooey centre, packed with Belgian chocolate chips.',
        'https://images.unsplash.com/photo-1673551490802-946446ed83e1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Salted Caramel Chunk', 2.80, 'New',
        'Buttery cookie dough folded with salted caramel chunks.',
        'https://plus.unsplash.com/premium_photo-1695865414374-903a800cce8b?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Vegan Double Choc', 2.70, 'Vegan',
        'Rich cocoa dough loaded with dairy-free chocolate chunks.',
        'https://images.unsplash.com/photo-1697961533207-2c15cffdb4f1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('White Chocolate & Raspberry', 2.90, 'Popular',
        'Creamy white chocolate chips paired with tangy raspberry pieces.',
        'https://plus.unsplash.com/premium_photo-1670895802114-dc3bc13b5963?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Peanut Butter Swirl', 2.80, 'Gluten-friendly',
        'Soft peanut butter cookie with a swirl of roasted peanut paste.',
        'https://images.unsplash.com/photo-1612565274448-4f733160b06b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Oatmeal Raisin', 2.40, 'Classic',
        'Chewy oats with sweet raisins and a hint of cinnamon.',
        'https://plus.unsplash.com/premium_photo-1670938559598-135dfaabe8e5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Nutella-Stuffed Cookie', 3.20, 'Filled',
        'Soft cookie exterior hiding a molten Nutella centre.',
        'https://images.unsplash.com/photo-1517400847543-fd27a32c8d12?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Triple Chocolate', 2.90, 'Rich',
        'Dark, milk, and white chocolate chips all in one indulgent bite.',
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('S’mores Cookie', 3.00, 'Seasonal',
        'Chocolate chip dough with marshmallows and graham cracker crumbs.',
        'https://plus.unsplash.com/premium_photo-1670895802120-0837b826f43d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Cinnamon Sugar Snickerdoodle', 2.50, 'Soft',
        'Rolled in cinnamon sugar with a perfectly chewy centre.',
        'https://images.unsplash.com/photo-1703187839559-3ae0b51bd4f1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Coffee Caramel Crunch', 3.10, 'Café favourite',
        'Espresso-infused dough with caramel brittle pieces.',
        'https://images.unsplash.com/photo-1727245243412-f7b6ca9d1b90?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),

       ('Mint Choc Chip', 2.80, 'Fresh',
        'Minty dough with dark chocolate chunks for a refreshing treat.',
        'https://images.unsplash.com/photo-1697961533293-caa219f0b75b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
```
### 5. Create the reviews table
```sql
CREATE TABLE reviews
(
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- link to registered user; null for anonymous reviews
    user_id    INT UNSIGNED NULL,
    author     VARCHAR(255) NULL,
    content    TEXT      NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);

CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_created_at ON reviews (created_at);
```

### 6. Security Logs
```sql
CREATE TABLE security_logs
(
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT UNSIGNED NULL,
    -- log events such as: logins success/fail, admin views users etc
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    details    VARCHAR(255) NULL,

    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_security_logs_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);

CREATE INDEX idx_security_logs_user_id ON security_logs (user_id);
CREATE INDEX idx_security_logs_event_type ON security_logs (event_type);
CREATE INDEX idx_security_logs_created_at ON security_logs (created_at);
```

## **Known Vulnerabilities**
