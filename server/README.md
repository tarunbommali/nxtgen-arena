# NxtGen Arena - Backend Service

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-v18%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

This repository contains the backend REST API for **NxtGen Arena**, a comprehensive Contest, Hackathon, and Skill Assessment platform. The service is responsible for handling user authentication, contest management, submission tracking, and leaderboard generation.

It is built using **Node.js**, **Express**, and **MySQL**, following a scalable **MVC (Model-View-Controller)** architecture.

---

## 🛠 Tech Stack

*   **Runtime Environment:** Node.js (v18+)
*   **Framework:** Express.js
*   **Database:** MySQL (Relational Data Store)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Security:** Bcrypt (Password Hashing), Helmet (Headers), CORS
*   **Testing (Future):** Jest / Supertest

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0+)
*   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nxtgen-backend.git
cd nxtgen-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`.

```bash
cp .env.example .env
```

**Required Variables:**

```ini
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nxtgen_arena_db

# Security
JWT_SECRET=super_secret_key_change_me_in_prod
JWT_EXPIRE=7d
```

### 4. Database Setup

The application includes an auto-init script. However, ensure your MySQL server is running and the database user has permissions to create databases/tables.

```bash
# Verify MySQL connection
mysql -u root -p
```

### 5. Run the Application

**Development Mode (with Nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server should be running at `http://localhost:5000`.

---

## 📂 Project Structure

The project follows a modular structure for scalability.

```
src/
├── config/         # Database and environment configurations
├── controllers/    # Request handlers (Business Logic)
├── middlewares/    # Middleware (Auth, Validation, Error Handling)
├── models/         # Database Models & Queries (DAO Pattern)
├── routes/         # API Route Definitions
├── services/       # Complex business logic (optional separation)
├── utils/          # Helper functions (Logger, Date parsers)
└── app.js          # Express app setup
```

---

## 🔌 API Documentation

Detailed API documentation is available in [API_DOCS.md](./API_DOCS.md).

### Quick Reference

| Module | Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | Register a new user | ❌ |
| **Auth** | POST | `/api/auth/login` | User login | ❌ |
| **Contest** | GET | `/api/contests` | Get all active contests | ❌ |
| **Contest** | POST | `/api/contests` | Create a new contest | ✅ (Admin) |
| **Submissions**| POST | `/api/submissions` | Submit a solution | ✅ (Student) |

---

## 🔐 Security Best Practices

*   **Sanitization:** All inputs are validated to prevent SQL Injection.
*   **Headers:** `helmet` middleware is recommended for secure HTTP headers.
*   **Passwords:** Stored using robust `bcrypt` hashing.
*   **Rate Limiting:** `express-rate-limit` is applied to auth routes (todo).

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
