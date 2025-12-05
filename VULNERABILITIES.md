## 1.1 SQL Injection

### Location
Login page
### Description
The login query is constructed using string concatenation, allowing you to break out of the query and inject SQL.

### How to Test
On the Login page, enter:

**Email:** `' OR '1'='1' #`

**Password:** anything

**OR**

**Username:** any value

**Password:** `' OR '1'='1`

### Expected
You are logged in as the first user in the database.

---

## 1.2 Cross-Site Scripting (XSS)

### 1.2.1 Stored XSS (Database-Persistent)
#### Location
Reviews page
#### Description
User-submitted HTML is stored in the database and rendered via `dangerouslySetInnerHTML`.
#### How to Test
In the text area of the review field, input the following:

```html
<img src="x" onerror="alert('Stored XSS')">
```

When you reload the page an alert appears for every visitor.

---

### 1.2.2 Reflected XSS
#### Location
The cookies page
#### How to Test
Visit:

```
http://localhost:5173/cookies?q=<img src=x onerror="alert('Reflected XSS')">
```

Alert appears immediately when the page loads.

---

### 1.2.3 DOM-Based XSS (Client-Side Only)
#### Location
- `Home.jsx` (reads `window.location.hash` and injects it via `.innerHTML`)
#### How to Test
Visit:

```
http://localhost:5173/#<img src=x onerror="alert('DOM XSS')">
```

Browser URL-encodes the payload; the page decodes it and injects it → alert fires.

---

## 1.3 Sensitive Data Exposure

### Locations
- `GET /api/users` returns all users including plaintext passwords
- `POST /api/login` returns full user record including password
- Passwords stored in plaintext in database (`/api/register`)
- Account page displays the user’s password

### How to Test
Visit:

```
http://localhost:5000/api/users
```

View all user credentials in plain text.