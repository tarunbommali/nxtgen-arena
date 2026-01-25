# 📅 Day 20: Authentication & Security - Protecting Your API

**Module:** Databases & Backend (Days 16-20)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Advanced - critical security concepts)

---

## 🎯 Today's Objectives

By end of today, you will master:
- JWT (JSON Web Tokens) authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- API security best practices
- Rate limiting and CORS
- Common security vulnerabilities (OWASP Top 10)

**Real-world relevance:** Security breaches cost companies millions! Every backend developer MUST understand authentication and security.

---

## 📚 Theory (30-45 minutes)

### **1. Authentication vs Authorization**

```
Authentication: WHO are you? (Login)
Authorization: WHAT can you do? (Permissions)

Example:
- Authentication: Rajesh logs in with password ✓
- Authorization: Can Rajesh delete products? (Admin only) ❌
```

---

### **2. Password Security**

**❌ NEVER DO THIS:**
```python
# Storing plaintext password
password = "12345"  # If hacked, all passwords exposed!
```

**✅ CORRECT WAY:**
```python
import hashlib
import os

# 1. Hash with salt
password = "12345"
salt = os.urandom(32)
hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)

# Database stores: salt + hashed (not original password!)

# 2. Better: Use bcrypt (handles salt automatically)
import bcrypt
hashed = bcrypt.hashpw(b"12345", bcrypt.gensalt())
```

**Why Hashing?**
- One-way function (can't get original password back)
- Same password always produces same hash
- Adding salt prevents rainbow table attacks

---

### **3. JWT (JSON Web Tokens)**

**Session-based Auth (Old Way):**
```
User logs in → Server creates session → Stores in database
Every request → Server checks session in database (slow!)
```

**Token-based Auth (Modern):**
```
User logs in → Server creates JWT token → Returns to client
Every request → Client sends token → Server verifies (no database hit!)
```

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2NH0.x7g2K...
└────────── Header ──────────┘ └─── Payload ──┘ └── Signature ──┘

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"user_id": 1, "exp": 1640000000}
Signature: HMAC-SHA256(header + payload, secret_key)
```

**Benefits:**
- ✅ Stateless (no database lookup)
- ✅ Works across multiple servers
- ✅ Can include user data (user_id, role)
- ✅ Has expiration

---

### **4. OWASP Top 10 Security Risks**

```
1. SQL Injection - NEVER concatenate user input to SQL
2. Broken Authentication - Weak passwords, no 2FA
3. Sensitive Data Exposure - Storing passwords in plaintext
4. XML External Entities (XXE)
5. Broken Access Control - Users accessing admin features
6. Security Misconfiguration - Debug mode ON in production
7. Cross-Site Scripting (XSS) - Malicious scripts in inputs
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging & Monitoring
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Complete Authentication System** (40 mins)

```python
# auth_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
import re

app = Flask(__name__)
CORS(app)

# SECRET KEY (in production, use environment variable!)
SECRET_KEY = "your-secret-key-change-this-in-production"

# Database connection
def get_db():
    return psycopg2.connect(
        host="localhost",
        database="flipkart_db",
        user="postgres",
        password="your_password"
    )

# ============ HELPER FUNCTIONS ============

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password):
    """
    Password must have:
    - At least 8 characters
    - At least one uppercase
    - At least one lowercase
    - At least one number
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is strong"

def hash_password(password):
    """Hash password with bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, email, role='user'):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=24),  # Expires in 24 hours
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

# ============ AUTHENTICATION DECORATOR ============

def token_required(f):
    """Decorator to protect routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'success': False, 'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing'}), 401
        
        # Verify token
        payload = decode_token(token)
        if not payload:
            return jsonify({'success': False, 'message': 'Token is invalid or expired'}), 401
        
        # Pass user info to route
        return f(current_user=payload, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator for admin-only routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing'}), 401
        
        payload = decode_token(token)
        if not payload:
            return jsonify({'success': False, 'message': 'Token is invalid'}), 401
        
        if payload.get('role') != 'admin':
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        return f(current_user=payload, *args, **kwargs)
    
    return decorated

# ============ AUTH ROUTES ============

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        # Validation
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        
        if not email or not password or not full_name:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        if not validate_email(email):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        is_strong, msg = validate_password_strength(password)
        if not is_strong:
            return jsonify({'success': False, 'message': msg}), 400
        
        # Check if email exists
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
        # Hash password
        password_hash = hash_password(password)
        
        # Insert user
        cur.execute("""
            INSERT INTO users (email, password_hash, full_name)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (email, password_hash, full_name))
        
        user_id = cur.fetchone()[0]
        conn.commit()
        
        # Generate token
        token = generate_token(user_id, email)
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'data': {
                'user_id': user_id,
                'email': email,
                'token': token
            }
        }), 201
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
        # Get user
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, password_hash, full_name
            FROM users
            WHERE email = %s
        """, (email,))
        
        user = cur.fetchone()
        if not user:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        user_id, email, password_hash, full_name = user
        
        # Verify password
        if not verify_password(password, password_hash):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user_id, email)
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user_id': user_id,
                'email': email,
                'full_name': full_name,
                'token': token
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current logged-in user"""
    return jsonify({
        'success': True,
        'data': {
            'user_id': current_user['user_id'],
            'email': current_user['email'],
            'role': current_user.get('role', 'user')
        }
    })

# ============ PROTECTED ROUTES ============

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get user profile (protected)"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, full_name, phone, created_at
            FROM users
            WHERE id = %s
        """, (current_user['user_id'],))
        
        user = cur.fetchone()
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        profile = {
            'id': user[0],
            'email': user[1],
            'full_name': user[2],
            'phone': user[3],
            'created_at': user[4].isoformat() if user[4] else None
        }
        
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'data': profile})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    """Get all users (admin only)"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, full_name, created_at
            FROM users
            ORDER BY created_at DESC
        """)
        
        users = []
        for row in cur.fetchall():
            users.append({
                'id': row[0],
                'email': row[1],
                'full_name': row[2],
                'created_at': row[3].isoformat() if row[3] else None
            })
        
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'data': users})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ============ RATE LIMITING (Simple) ============

from collections import defaultdict
import time

request_counts = defaultdict(list)

def rate_limit(max_requests=10, window=60):
    """Simple rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            client_ip = request.remote_addr
            now = time.time()
            
            # Remove old requests outside window
            request_counts[client_ip] = [
                req_time for req_time in request_counts[client_ip]
                if now - req_time < window
            ]
            
            # Check limit
            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({
                    'success': False,
                    'message': f'Rate limit exceeded. Max {max_requests} requests per {window} seconds'
                }), 429
            
            # Add current request
            request_counts[client_ip].append(now)
            
            return f(*args, **kwargs)
        return decorated
    return decorator

@app.route('/api/public/search', methods=['GET'])
@rate_limit(max_requests=20, window=60)
def public_search():
    """Public endpoint with rate limiting"""
    query = request.args.get('q', '')
    return jsonify({
        'success': True,
        'message': f'Search results for: {query}',
        'data': []
    })

# ============ RUN SERVER ============

if __name__ == '__main__':
    print("🔐 Starting Secure API Server...")
    print("📍 Base URL: http://localhost:5001")
    print("\nEndpoints:")
    print("  POST /api/auth/register - Register user")
    print("  POST /api/auth/login - Login")
    print("  GET  /api/auth/me - Get current user (protected)")
    print("  GET  /api/profile - Get profile (protected)")
    print("  GET  /api/admin/users - Get all users (admin only)")
    print("\n Press Ctrl+C to stop\n")
    
    app.run(debug=True, port=5001)
```

**Install:**
```bash
pip install Flask flask-cors bcrypt PyJWT psycopg2-binary
```

---

### **Task 2: Test Authentication Flow** (20 mins)

```python
# test_auth.py
import requests
import json

BASE_URL = "http://localhost:5001/api"

print("=== AUTHENTICATION FLOW TEST ===\n")

# 1. Register new user
print("1. REGISTER NEW USER")
user_data = {
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User"
}

response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    data = response.json()['data']
    print(f"   User ID: {data['user_id']}")
    print(f"   Token: {data['token'][:50]}...")
    token = data['token']
else:
    print(f"   Error: {response.json().get('message')}")

# 2. Login
print("\n2. LOGIN")
login_data = {
    "email": "test@example.com",
    "password": "SecurePass123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()['data']
    print(f"   Welcome, {data['full_name']}!")
    token = data['token']

# 3. Access protected route WITHOUT token
print("\n3. ACCESS PROTECTED ROUTE (No Token)")
response = requests.get(f"{BASE_URL}/profile")
print(f"   Status: {response.status_code}")
print(f"   Message: {response.json().get('message')}")

# 4. Access protected route WITH token
print("\n4. ACCESS PROTECTED ROUTE (With Valid Token)")
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/profile", headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    profile = response.json()['data']
    print(f"   Email: {profile['email']}")
    print(f"   Name: {profile['full_name']}")

# 5. Access admin route (should fail - not admin)
print("\n5. ACCESS ADMIN ROUTE (Regular User)")
response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
print(f"   Status: {response.status_code}")
print(f"   Message: {response.json().get('message')}")

# 6. Test rate limiting
print("\n6. RATE LIMITING TEST (20 requests/min)")
for i in range(25):
    response = requests.get(f"{BASE_URL}/public/search?q=test")
    if response.status_code == 429:
        print(f"   Request {i+1}: ❌ Rate limited!")
        break
    elif i < 3 or i > 20:
        print(f"   Request {i+1}: ✓ OK")

print("\n✅ Authentication tests complete!")
```

---

### **Task 3: Security Best Practices Checklist** (15 mins)

Create `SECURITY.md`:

```markdown
# Security Best Practices Checklist

## ✅ Implemented
- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] Password strength validation
- [x] Email format validation
- [x] Rate limiting on public endpoints
- [x] CORS configuration
- [x] Token expiration (24 hours)
- [x] SQL parameterized queries (prevents injection)

## ⚠️ TODO for Production
- [ ] HTTPS only (no HTTP)
- [ ] Environment variables for secrets
- [ ] 2FA (Two-Factor Authentication)
- [ ] Account lockout after failed attempts
- [ ] Password reset via email
- [ ] Refresh tokens
- [ ] IP whitelist for admin routes
- [ ] Security headers (HSTS, CSP)
- [ ] Input sanitization
- [ ] Logging and monitoring
- [ ] Regular security audits

## 🔒 Secure Password Storage
```python
# ❌ NEVER
user.password = "plaintext"

# ✅ ALWAYS
import bcrypt
hashed = bcrypt.hashpw(b"password", bcrypt.gensalt())
```

## 🔑 JWT Best Practices
- Use strong SECRET_KEY (256-bit random)
- Set reasonable expiration (1-24 hours)
- Use refresh tokens for long sessions
- Invalidate tokens on logout (token blacklist)
- Store tokens securely on client (httpOnly cookies)

## 🛡️ SQL Injection Prevention
```python
# ❌ DANGEROUS
query = f"SELECT * FROM users WHERE email = '{email}'"

# ✅ SAFE (parameterized)
query = "SELECT * FROM users WHERE email = %s"
cur.execute(query, (email,))
```

## 🌐 CORS Configuration
```python
# Development: Allow all
CORS(app)

# Production: Whitelist domains
CORS(app, origins=["https://myapp.com"])
```

## 📊 Rate Limiting
- Public endpoints: 100 req/min
- Auth endpoints: 5 req/min
- Search: 20 req/min
- Admin: Restricted by IP

## 🔍 Regular Audits
- Review access logs weekly
- Update dependencies monthly
- Security penetration testing quarterly
- Third-party security audit annually
```

---

## ✅ Module 4 Complete! Verification Checklist

Ensure you can:

- [ ] Implement JWT authentication
- [ ] Hash passwords with bcrypt
- [ ] Create protected API routes
- [ ] Implement role-based access control
- [ ] Add rate limiting
- [ ] Validate user input
- [ ] Prevent SQL injection
- [ ] Understand OWASP Top 10

---

## 📖 Resources

- **JWT.io:** [jwt.io](https://jwt.io/) - Decode & verify tokens
- **OWASP:** [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/)
- **bcrypt:** [github.com/pyca/bcrypt](https://github.com/pyca/bcrypt/)

---

## 🎓 **MODULE 4 COMPLETE - Knowledge Checkpoint**

### **🎉 Congratulations! Module 4: Databases & Backend Complete!**

### **📚 What You Learned (Days 16-20)**

#### **Day 16: Database Systems**
- ✅ SQL vs NoSQL comparison
- ✅ ACID properties and transactions
- ✅ PostgreSQL schema design (e-commerce)
- ✅ Foreign keys and relationships

#### **Day 17: SQL Mastery**
- ✅ Complex JOINs (INNER, LEFT, FULL OUTER)
- ✅ Window functions and CTEs
- ✅ Query optimization with indexes
- ✅ Business analytics queries

#### **Day 18: NoSQL Databases**
- ✅ MongoDB document store
- ✅ Redis caching and sessions
- ✅ Hybrid SQL+NoSQL architecture
- ✅ When to use each database type

#### **Day 19: API Architecture**
- ✅ REST API design principles
- ✅ HTTP methods and status codes
- ✅ Flask API development
- ✅ Error handling and validation

#### **Day 20: Authentication & Security**
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ OWASP security best practices

---

### **📹 MANDATORY: Record Your Learning (5 minutes)**

**Recording Task:**

Record a **5-minute video/audio** explaining:

1. **Database Architecture (2 min):**
   - Design a complete e-commerce database schema
   - Explain tables: Users, Products, Orders, OrderItems
   - Show relationships with Foreign Keys
   - When would you use MongoDB instead?

2. **API Development (2 min):**
   - Walk through your REST API code
   - Explain: GET /api/products, POST /api/orders
   - Show authentication flow (login → JWT token → protected route)
   - Demonstrate error handling

3. **Security Implementation (1 min):**
   - Explain how you hash passwords (bcrypt)
   - Show JWT token structure (header.payload.signature)
   - Why SQL injection is dangerous and how to prevent it
   - Rate limiting example

**How to Record:**
```bash
# Option 1: API Demo
- Run your Flask API server
- Use Postman/cURL to test endpoints
- Screen record the entire flow

# Option 2: Database Walkthrough
- Open PostgreSQL/MongoDB
- Show your schema
- Run complex queries while explaining

# Option 3: Code Explanation
- Open your Day 16-20 projects
- Walk through authentication flow
- Explain security measures
```

**Save as:** `recordings/module_4_backend_databases.mp4`

---

### **🎯 Module 4 Mastery Check**

**Can you build these from scratch?**
- [ ] Complete REST API with CRUD operations
- [ ] User authentication with JWT
- [ ] Database with 5+ related tables
- [ ] Caching layer with Redis
- [ ] Password hashing and validation

**Can you explain these?**
- [ ] Difference between SQL and NoSQL with examples
- [ ] What are ACID properties?
- [ ] How does JWT authentication work?
- [ ] When to use indexing in databases?
- [ ] What is SQL injection and how to prevent it?

---

### **🔗 Real-World Skills You Now Have**

| Skill | Industry Usage |
|-------|----------------|
| **PostgreSQL** | Used by Instagram, Spotify, Netflix |
| **MongoDB** | Used by eBay, Adobe, Forbes |
| **Redis** | Used by Twitter, GitHub, Stack Overflow |
| **REST APIs** | 100% of modern apps use APIs |
| **JWT Auth** | Standard for microservices |

**You can now build:** Flipkart clone, Paytm wallet, Twitter API, Blog platform, SaaS dashboard

---

### **📊 Progress Checkpoint**

**✅ Completed:** Days 1-20 (67% of 30-day foundation!)  
**⏭️ Next:** Module 5 - Cloud & DevOps (Days 21-25)  
**💰 Skills Worth:** ₹8-12 LPA for backend developer roles!  

---

### **🎯 Before Starting Module 5**

**Required Actions:**
1. ✅ **Record 5-minute backend demo** (see above)
2. ✅ Deploy your API to a cloud platform (Heroku/Railway free tier)
3. ✅ Push all database schemas and API code to GitHub
4. ✅ Write API documentation (README.md with endpoints)

**Portfolio Project (Recommended):**
Build a complete backend for:
- TODO List API with auth
- Blog platform with comments
- E-commerce cart system
- Social media feed API

**Practice:**
- Solve API design questions on System Design interviews
- Review OWASP Top 10 security vulnerabilities
- Practice writing complex SQL queries

---

### **⏸️ TAKE A WELL-DESERVED BREAK!**

**Module 4 was INTENSE!** You built production-ready backend skills.

- ✅ **Celebrate** - You can now build complex web applications!
- ✅ **Review** - Skim through your APIs and database code
- ✅ **Practice** - Build one full-stack project (frontend + your API)

**What's Coming:**
- ☁️ Module 5 = Cloud & DevOps (Docker, CI/CD, Testing)
- 🎯 Deploy your apps to the cloud
- 💼 Learn skills for DevOps Engineer roles (₹10-18 LPA!)

**Only 10 Days Left to Complete the Foundation! 💪**

---

**"Databases store the world's data. APIs connect the world. You now know both!" 🌍**

**Tomorrow:** Day 21 - Cloud Computing & Virtualization

[← Day 19: API Architecture](./Day%2019%20-%20API%20Architecture.md) | [Module 5: Day 21 - Cloud →](../Module%205%20-%20Cloud%20&%20DevOps%20(Days%2021-25)/Day%2021%20-%20Virtualization%20&%20Cloud.md)

[← Day 19: API Architecture](./Day%2019%20-%20API%20Architecture.md) | [Module 5: Day 21 - Cloud Computing →](../Module%205%20-%20Cloud%20&%20DevOps%20Ops%20(Days%2021-25)/Day%2021%20-%20Virtualization%20&%20Cloud.md)
