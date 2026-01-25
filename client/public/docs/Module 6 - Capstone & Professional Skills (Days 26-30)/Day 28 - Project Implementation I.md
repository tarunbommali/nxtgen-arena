# 📅 Day 28: Project Implementation I - Build Core Features

**Module:** Capstone & Professional Skills (Days 26-30)  
**Time Required:** 6-8 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ **BUILD DAY!**

---

## 🎯 Today's Goal

Build the core functionality of your capstone project:
- User authentication (register, login, JWT)
- Product management (CRUD)
- Database integration
- Basic tests
- Deploy to staging

**This is where EVERYTHING you've learned comes together!**

---

## 💻 Implementation Checklist

### **Phase 1: Foundation (2 hours)**

**✅ Setup:**
```bash
# Activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb flipkart_db  # Or use Docker: docker-compose up -d db
```

**✅ app.py (Entry point):**
```python
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')

# Import routes
from app.routes import auth, products

app.register_blueprint(auth.bp)
app.register_blueprint(products.bp)

@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

### **Phase 2: Authentication (2-3 hours)**

**✅ app/models/user.py:**
```python
import bcrypt
import psycopg2
import os

def get_db():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

def create_user_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

**✅ app/routes/auth.py:**
```python
from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from app.models.user import *
import os

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    
    if not all([email, password, full_name]):
        return jsonify({'error': 'All fields required'}), 400
    
    # Create user
    conn = get_db()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id",
            (email, hash_password(password), full_name)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
        # Generate JWT
        token = jwt.encode(
            {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(days=1)},
            os.getenv('SECRET_KEY'),
            algorithm='HS256'
        )
        
        return jsonify({'token': token, 'user_id': user_id}), 201
    
    except psycopg2.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 400
    finally:
        cur.close()
        conn.close()

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    if not user or not verify_password(password, user[1]):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = jwt.encode(
        {'user_id': user[0], 'exp': datetime.utcnow() + timedelta(days=1)},
        os.getenv('SECRET_KEY'),
        algorithm='HS256'
    )
    
    return jsonify({'token': token, 'user_id': user[0]}), 200
```

---

### **Phase 3: Products CRUD (2-3 hours)**

**✅ app/models/product.py:**
```python
from app.models.user import get_db

def create_product_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            stock INTEGER DEFAULT 0,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()
```

**✅ app/routes/products.py:**
```python
from flask import Blueprint, request, jsonify
from app.models.product import *
from app.middlewares.auth import token_required

bp = Blueprint('products', __name__, url_prefix='/api/products')

@bp.route('', methods=['GET'])
def get_products():
    search = request.args.get('search', '')
    category = request.args.get('category')
    
    conn = get_db()
    cur = conn.cursor()
    
    query = "SELECT * FROM products WHERE name ILIKE %s"
    params = [f'%{search}%']
    
    if category:
        query += " AND category = %s"
        params.append(category)
    
    cur.execute(query, params)
    products = cur.fetchall()
    
    result = [{
        'id': p[0],
        'name': p[1],
        'description': p[2],
        'price': float(p[3]),
        'stock': p[4],
        'category': p[5]
    } for p in products]
    
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@token_required
def create_product(current_user):
    data = request.get_json()
    
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO products (name, description, price, stock, category)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (data['name'], data['description'], data['price'], data['stock'], data['category']))
    
    product_id = cur.fetchone()[0]
    conn.commit()
    
    return jsonify({'id': product_id}), 201
```

---

### **Phase 4: Testing (1-2 hours)**

**✅ tests/test_auth.py:**
```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register(client):
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'Test@123',
        'full_name': 'Test User'
    })
    
    assert response.status_code == 201
    assert 'token' in response.json

def test_login(client):
    # First register
    client.post('/api/auth/register', json={
        'email': 'test2@example.com',
        'password': 'Test@123',
        'full_name': 'Test User'
    })
    
    # Then login
    response = client.post('/api/auth/login', json={
        'email': 'test2@example.com',
        'password': 'Test@123'
    })
    
    assert response.status_code == 200
    assert 'token' in response.json
```

**Run tests:**
```bash
pytest tests/ -v --cov=app
```

---

### **Phase 5: Deploy to Staging (1 hour)**

**✅ Create Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

**✅ Deploy to Railway:**
```bash
# Push to GitHub
git add .
git commit -m "Day 28: Core features complete"
git push origin main

# Deploy on Railway (auto-deploys from GitHub)
```

---

## ✅ End of Day 28 Checklist

- [ ] User registration working
- [ ] User login with JWT working
- [ ] Products CRUD endpoints working
- [ ] Database properly connected
- [ ] All tests passing
- [ ] Deployed to staging environment
- [ ] Code committed to GitHub

---

## 🚀 Wrap Up

**Congratulations!** Your core API is working! 🎉

**Tomorrow:** Day 29 - Advanced features (orders, cart, admin panel)

[← Day 27: Planning](./Day%2027%20-%20Project%20Planning.md) | [Day 29: Implementation II →](./Day%2029%20-%20Project%20Implementation%20II.md)
