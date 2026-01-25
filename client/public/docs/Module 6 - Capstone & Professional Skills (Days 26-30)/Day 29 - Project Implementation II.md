# 📅 Day 29: Project Implementation II - Complete the MVP

**Module:** Capstone & Professional Skills (Days 26-30)  
**Time Required:** 6-8 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ **BUILD DAY 2!**

---

## 🎯 Today's Goal

Complete your MVP with advanced features:
- Shopping cart (using Redis)
- Order management
- Admin protected routes
- Integration tests
- Production deployment

**By EOD, you'll have a COMPLETE portfolio project!**

---

## 💻 Implementation Checklist

### **Phase 1: Shopping Cart (2 hours)**

**✅ app/models/cart.py:**
```python
import redis
import json
import os

redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))

def get_cart(user_id):
    """Get user's cart from Redis"""
    cart = redis_client.get(f'cart:{user_id}')
    return json.loads(cart) if cart else []

def add_to_cart(user_id, product_id, quantity):
    """Add item to cart"""
    cart = get_cart(user_id)
    
    # Check if product already in cart
    for item in cart:
        if item['product_id'] == product_id:
            item['quantity'] += quantity
            break
    else:
        cart.append({'product_id': product_id, 'quantity': quantity})
    
    redis_client.setex(f'cart:{user_id}', 86400, json.dumps(cart))  # Expire in 24h
    return cart

def remove_from_cart(user_id, product_id):
    """Remove item from cart"""
    cart = get_cart(user_id)
    cart = [item for item in cart if item['product_id'] != product_id]
    redis_client.setex(f'cart:{user_id}', 86400, json.dumps(cart))
    return cart

def clear_cart(user_id):
    """Clear entire cart"""
    redis_client.delete(f'cart:{user_id}')
```

**✅ app/routes/cart.py:**
```python
from flask import Blueprint, request, jsonify
from app.models.cart import *
from app.middlewares.auth import token_required

bp = Blueprint('cart', __name__, url_prefix='/api/cart')

@bp.route('', methods=['GET'])
@token_required
def get_user_cart(current_user):
    cart = get_cart(current_user['user_id'])
    return jsonify({'cart': cart}), 200

@bp.route('', methods=['POST'])
@token_required
def add_item(current_user):
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    cart = add_to_cart(current_user['user_id'], product_id, quantity)
    return jsonify({'cart': cart}), 200

@bp.route('/<int:product_id>', methods=['DELETE'])
@token_required
def remove_item(current_user, product_id):
    cart = remove_from_cart(current_user['user_id'], product_id)
    return jsonify({'cart': cart}), 200
```

---

### **Phase 2: Order Management (2-3 hours)**

**✅ app/models/order.py:**
```python
from app.models.user import get_db
from app.models.cart import get_cart, clear_cart
from app.models.product import get_db

def create_orders_table():
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            total_amount DECIMAL(10, 2),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER,
            price_at_purchase DECIMAL(10, 2)
        )
    """)
    
    conn.commit()
    cur.close()
    conn.close()

def create_order(user_id):
    """Create order from user's cart"""
    cart = get_cart(user_id)
    
    if not cart:
        raise ValueError("Cart is empty")
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Calculate total
        total = 0
        for item in cart:
            cur.execute("SELECT price, stock FROM products WHERE id = %s", (item['product_id'],))
            product = cur.fetchone()
            
            if not product:
                raise ValueError(f"Product {item['product_id']} not found")
            
            price, stock = product
            
            if stock < item['quantity']:
                raise ValueError(f"Insufficient stock for product {item['product_id']}")
            
            total += float(price) * item['quantity']
        
        # Create order
        cur.execute(
            "INSERT INTO orders (user_id, total_amount) VALUES (%s, %s) RETURNING id",
            (user_id, total)
        )
        order_id = cur.fetchone()[0]
        
        # Create order items & update stock
        for item in cart:
            cur.execute("SELECT price FROM products WHERE id = %s", (item['product_id'],))
            price = cur.fetchone()[0]
            
            cur.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (%s, %s, %s, %s)
            """, (order_id, item['product_id'], item['quantity'], price))
            
            # Decrease stock
            cur.execute(
                "UPDATE products SET stock = stock - %s WHERE id = %s",
                (item['quantity'], item['product_id'])
            )
        
        conn.commit()
        
        # Clear cart
        clear_cart(user_id)
        
        return order_id
    
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()
```

**✅ app/routes/orders.py:**
```python
from flask import Blueprint, request, jsonify
from app.models.order import *
from app.middlewares.auth import token_required

bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@bp.route('', methods=['POST'])
@token_required
def create_new_order(current_user):
    try:
        order_id = create_order(current_user['user_id'])
        return jsonify({'order_id': order_id, 'message': 'Order created'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    conn = get_db()
    cur = conn.cursor()
    
    # Get order
    cur.execute("""
        SELECT o.id, o.total_amount, o.status, o.created_at
        FROM orders o
        WHERE o.id = %s AND o.user_id = %s
    """, (order_id, current_user['user_id']))
    
    order = cur.fetchone()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Get order items
    cur.execute("""
        SELECT p.name, oi.quantity, oi.price_at_purchase
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = %s
    """, (order_id,))
    
    items = cur.fetchall()
    
    return jsonify({
        'id': order[0],
        'total_amount': float(order[1]),
        'status': order[2],
        'created_at': order[3].isoformat(),
        'items': [{'name': i[0], 'quantity': i[1], 'price': float(i[2])} for i in items]
    }), 200

@bp.route('/user', methods=['GET'])
@token_required
def get_user_orders(current_user):
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, total_amount, status, created_at
        FROM orders
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (current_user['user_id'],))
    
    orders = cur.fetchall()
    
    result = [{
        'id': o[0],
        'total_amount': float(o[1]),
        'status': o[2],
        'created_at': o[3].isoformat()
    } for o in orders]
    
    return jsonify({'orders': result}), 200
```

---

### **Phase 3: Integration Tests (1-2 hours)**

**✅ tests/test_complete_workflow.py:**
```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_complete_shopping_flow(client):
    # 1. Register
    response = client.post('/api/auth/register', json={
        'email': 'shopper@example.com',
        'password': 'Pass@123',
        'full_name': 'Test Shopper'
    })
    assert response.status_code ==201
    token = response.json['token']
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # 2. Browse products
    response = client.get('/api/products')
    assert response.status_code == 200
    
    # 3. Add to cart
    response = client.post('/api/cart', 
        headers=headers,
        json={'product_id': 1, 'quantity': 2})
    assert response.status_code == 200
    
    # 4. View cart
    response = client.get('/api/cart', headers=headers)
    assert len(response.json['cart']) > 0
    
    # 5. Create order
    response = client.post('/api/orders', headers=headers)
    assert response.status_code == 201
    order_id = response.json['order_id']
    
    # 6. View order
    response = client.get(f'/api/orders/{order_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['status'] == 'pending'
```

---

### **Phase 4: Production Deployment (1 hour)**

**✅ Update docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/flipkart
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=flipkart
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

**✅ Deploy:**
```bash
# Commit all changes
git add .
git commit -m "Day 29: Complete MVP with cart, orders, tests"
git push origin main

# Railway auto-deploys!
```

---

## ✅ End of Day 29 Checklist

- [ ] Shopping cart with Redis working
- [ ] Order creation and history working
- [ ] Stock management updating correctly
- [ ] All integration tests passing
- [ ] Deployed to production
- [ ] Complete API tested end-to-end

---

## 🚀 Wrap Up

**AMAZING WORK!** You now have a complete, production-ready API! 🎉

**Tomorrow:** Day 30 - FINAL DAY (Polish, document, reflect, celebrate!)

[← Day 28: Implementation I](./Day%2028%20-%20Project%20Implementation%20I.md) | [Day 30: Reflection & Completion →](./Day%2030%20-%20Code%20Review%20&%20Reflection.md)
