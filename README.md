# Josh's Cookie Company
A full-stack e-commerce style web application built using **React**, **Express**, and **MySQL**, designed as part of the *Secure Application Programming* module.
This project includes both a **Secure** and **Insecure** version to demonstrate common vulnerabilities, mitigations, and secure coding practices.

---

## 🍪 **Overview**

Josh’s Cookie Company is a fictional bakery website where customers can:

* Browse cookies
* View product details
* Add items to cart (coming soon)
* Create/manage accounts (coming soon)
* Place orders (future addition)

The insecure branch intentionally includes OWASP Top 10 vulnerabilities for academic demonstration.

---

## 🧱 **Tech Stack**

### **Frontend**

* React (Vite)
* React Router
* Axios
* Bootstrap 5
* Custom theme (Apple Notes orange)

### **Backend**

* Node.js + Express
* MySQL2 (Promise API)
* REST API structure with separated routes

### **Database**

* MySQL
* Tables:

    * `users`
    * `cookies` (products)
    * More coming (orders, reviews, etc.)

---

# 🚀 **Features**

### ✔ Implemented

* Homepage with dynamic hero, featured cookies, testimonials, and sections
* Fully responsive Bootstrap layout
* Cookies stored in MySQL
* API endpoint: `/api/cookies`
* API endpoint: `/api/users` (insecure version leaks everything)
* Real images via Unsplash
* Insecure routes for education (Sensitive Data Exposure)

### 🔜 Coming Soon

* Login + Register pages
* Cart page + Add-to-cart functionality
* Order placement
* Admin dashboard
* Secure versions of all routes and SQL queries
* SQL injection examples (in insecure branch)

---

# 🗂 **Project Structure**

```
secure-app-project/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   └── routes/
│   │       ├── users.js
│   │       └── cookies.js
│   ├── package.json
│   └── .env  (ignored by Git)
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Cookies.jsx
    │   │   ├── Login.jsx
    │   │   ├── Account.jsx
    │   │   └── Users.jsx (debug/insecure)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   └── styles/
    │       └── globals.css
    └── package.json
```

---

# 🛠 **Installation & Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd secure-app-project
```

---

## 🔧 **Backend Setup**

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
DB_NAME=josh_cookie_company
```

### 3. Start the Backend

```bash
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

Test the API:

```
http://localhost:5000/api/health
http://localhost:5000/api/cookies
http://localhost:5000/api/users   (insecure)
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

# 🗄 **Database Setup**

### 1. Create the MySQL database

```sql
CREATE DATABASE josh_cookie_company;
USE josh_cookie_company;
```

### 2. Create `users` table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Create `cookies` table

```sql
CREATE TABLE cookies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(5,2),
  tag VARCHAR(100),
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 📸 **Screenshots**

Screenshots to be added later

---

# 📜 **License**

This project uses images from **Unsplash (free license)**.
