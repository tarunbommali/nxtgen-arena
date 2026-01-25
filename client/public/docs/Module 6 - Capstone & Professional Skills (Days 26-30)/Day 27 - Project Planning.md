# 📅 Day 27: Project Planning - Build Your Capstone

**Module:** Capstone & Professional Skills (Days 26-30)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆

---

## 🎯 Objectives

Plan your capstone project that showcases ALL your skills:
- Choose a project idea
- Define features and scope
- Create technical architecture
- Plan sprint timeline
- Setup project repository

**This project will be your portfolio centerpiece!**

---

## 📚 Project Ideas (Choose One)

### **Option 1: E-Commerce Platform (Recommended)**
- User auth, product catalog, cart, orders
- Payment integration (Razorpay sandbox)
- Admin dashboard
- Real-time inventory
- **Tech:** Flask + PostgreSQL + Redis + Docker

### **Option 2: Social Media Feed**
- Post creation, likes, comments
- Follow/unfollow users
- Timeline algorithm
- **Tech:** Flask + MongoDB + Redis

### **Option 3: Task Management (Like Trello)**
- Boards, lists, cards
- Drag-and-drop
- Team collaboration
- **Tech:** Flask + PostgreSQL + WebSockets

### **Option 4: Blog Platform**
- Rich text editor
- Comments, tags, categories
- User profiles
- **Tech:** Flask + PostgreSQL

---

## 💻 Planning Tasks (90-100 mins)

### **Task 1: Define Your Project** (20 mins)

**Create `PROJECT_PLAN.md`:**

```markdown
# Flipkart Clone - Capstone Project

## Overview
A production-ready e-commerce REST API with authentication, product management, and order processing.

## Target Users
- Shoppers: Browse and purchase products
- Sellers: Manage inventory
- Admins: Oversee platform

## Core Features (MVP - Minimum Viable Product)

### Must-Have (Days 28-29)
- [ ] User registration & JWT authentication
- [ ] Product CRUD (Create, Read, Update, Delete)
- [ ] Shopping cart
- [ ] Order placement
- [ ] PostgreSQL database with relationships
- [ ] Basic API documentation

### Should-Have (If time permits)
- [ ] Product search & filters
- [ ] Redis caching
- [ ] Admin dashboard
- [ ] Email notifications

### Nice-to-Have (Future enhancements)
- [ ] Payment gateway integration
- [ ] Product reviews & ratings
- [ ] Wishlist
- [ ] Recommendation engine

## Success Criteria
- ✅ All tests passing (>80% coverage)
- ✅ Deployed to cloud with CI/CD
- ✅ Complete API documentation
- ✅ Clean, well-commented code
- ✅ Professional README

## Timeline
- Day 27: Planning & setup
- Day 28: Core features (auth, products)
- Day 29: Advanced features (orders, cart)
- Day 30: Polish, deploy, document
```

---

### **Task 2: Technical Architecture** (30 mins)

**Create architecture diagram (use draw.io or ASCII):**

```
┌─────────────────────────────────────────────────┐
│                 CLIENT                           │
│          (Postman / Frontend)                    │
└────────────────┬────────────────────────────────┘
                 │ HTTP/JSON
                 ↓
┌────────────────────────────────────────────────┐
│           FLASK API SERVER                      │
│  ┌──────────────────────────────────────────┐  │
│  │  Routes        Middleware      Models     │  │
│  │  /auth         - JWT Auth      - User     │  │
│  │  /products     - CORS          - Product  │  │
│  │  /orders       - Error Handler - Order    │  │
│  └──────────────────────────────────────────┘  │
└────┬──────────────────────────────────────┬───┘
     │                                       │
     ↓                                       ↓
┌─────────────┐                    ┌──────────────┐
│ PostgreSQL  │                    │    Redis     │
│  Database   │                    │    Cache     │
│             │                    │              │
│ • users     │                    │ • sessions   │
│ • products  │                    │ • cart data  │
│ • orders    │                    │ • product    │
│ • order_items│                   │   cache      │
└─────────────┘                    └──────────────┘
```

**Database Schema:**

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100), role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(50),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items (Junction table)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2)
);
```

---

### **Task 3: Setup Project Repository** (30 mins)

```bash
# Create project
mkdir flipkart-clone
cd flipkart-clone

# Initialize Git
git init

# Create structure
mkdir app tests docs
touch app/__init__.py
touch app/{models,routes,middlewares}/__init__.py

# Create files
touch app.py
touch config.py
touch requirements.txt
touch Dockerfile
touch docker-compose.yml
touch .env.example
touch .gitignore
touch README.md
touch PROJECT_PLAN.md
```

**Project Structure:**
```
flipkart-clone/
├── app.py                      # Application entry point
├── config.py                   # Configuration
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_PLAN.md
├── app/
│   ├── __init__.py            # Flask app factory
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── products.py
│   │   └── orders.py
│   └── middlewares/
│       ├── __init__.py
│       └── auth.py
├── tests/
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_products.py
│   └── test_orders.py
└── docs/
    ├── API.md
    └── DEPLOYMENT.md
```

**requirements.txt:**
```txt
Flask==2.3.0
Flask-CORS==4.0.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
bcrypt==4.1.2
PyJWT==2.8.0
redis==5.0.1
gunicorn==21.2.0

# Testing
pytest==7.4.3
pytest-cov==4.1.0
```

**.gitignore:**
```
# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.env

# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Testing
.coverage
htmlcov/
.pytest_cache/

# Logs
*.log
```

---

### **Task 4: Create Development Roadmap** (20 mins)

**Create `DEVELOPMENT.md`:**

```markdown
# Development Roadmap

## Day 28: Core Features (6-8 hours)

### Morning (3-4 hours)
- [ ] Setup Flask app structure
- [ ] Database models (User, Product)
- [ ] User registration endpoint
- [ ] Login endpoint with JWT
- [ ] Write tests for auth

### Afternoon (3-4 hours)
- [ ] Product CRUD endpoints
- [ ] Product search & filters
- [ ] Write tests for products
- [ ] Deploy to Railway (staging)

**Checkpoint:** Auth + Products working

---

## Day 29: Advanced Features (6-8 hours)

### Morning (3-4 hours)
- [ ] Shopping cart (Redis)
- [ ] Order creation endpoint
- [ ] Order history endpoint
- [ ] Write tests for orders

### Afternoon (3-4 hours)
- [ ] Admin endpoints (protected)
- [ ] Error handling middleware
- [ ] Integration tests
- [ ] Deploy to production

**Checkpoint:** Complete working API

---

## Day 30: Polish & Documentation (4-6 hours)

### Morning (2-3 hours)
- [ ] Complete README.md
- [ ] API documentation
- [ ] Add CI/CD GitHub Actions
- [ ] Final deployment

### Afternoon (2-3 hours)
- [ ] Code review & refactoring
- [ ] Performance testing
- [ ] Create demo video
- [ ] Portfolio update

**Final Deliverables:**
- ✅ GitHub repository with clean code
- ✅ Live deployed API
- ✅ Complete documentation
- ✅ Test coverage >80%
- ✅ Demo video (optional)
```

---

## ✅ Verification

- [ ] Chosen a project idea
- [ ] Defined MVP features clearly
- [ ] Created technical architecture
- [ ] Setup project repository
- [ ] Created development timeline

---

## 🚀 Wrap Up

**Tomorrow:** Day 28 - BUILD DAY! (Core features implementation)

[← Day 26: Documentation](./Day%2026%20-%20Technical%20Documentation.md) | [Day 28: Implementation I →](./Day%2028%20-%20Project%20Implementation%20I.md)
