# 📅 Day 19: API Architecture - Connecting Frontend to Backend

**Module:** Databases & Backend (Days 16-20)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - integrates everything)

---

## 🎯 Today's Objectives

By end of today, you will:
- Build production-ready REST APIs with Flask
- Understand API design best practices
- Handle authentication with JWT tokens
- Implement error handling and validation
- Deploy API that frontend/mobile can consume

**Real-world relevance:** 100% of modern apps use APIs. Flipkart app → API → Database. This is how the web works!

---

## 📚 Theory (30-45 minutes)

### **1. What is an API?**

```
Mobile App/Website → HTTP Request → API → Database
                  ← JSON Response ←
```

**Example - Flipkart Search:**
```
User types "iPhone" in search
  ↓
Frontend: GET /api/products?search=iphone
  ↓
API: Query database
  ↓
API: Return JSON [{"id": 1, "name": "iPhone 15", ...}]
  ↓
Frontend: Display products
```

---

### **2. REST API Principles**

**REST = Representational State Transfer**

| HTTP Method | Action | Example |
|-------------|--------|---------|
| **GET** | Read/Retrieve | `GET /api/products` → List products |
| **POST** | Create | `POST /api/products` → Add product |
| **PUT** | Update (full) | `PUT /api/products/1` → Update product #1 |
| **PATCH** | Update (partial) | `PATCH /api/products/1` → Update price only |
| **DELETE** | Delete | `DELETE /api/products/1` → Remove product #1 |

**Resource-Based URLs:**
```
✅ GOOD:
  GET /api/users
  GET /api/users/123
  POST /api/users
  GET /api/users/123/orders

❌ BAD:
  GET /api/getUsers
  POST /api/createUser
  GET /api/user_orders?id=123
```

---

### **3. HTTP Status Codes**

```
2xx = Success
  200 OK - Request successful
  201 Created - New resource created
  204 No Content - Success, no data to return

4xx = Client Error
  400 Bad Request - Invalid input
  401 Unauthorized - Not logged in
  403 Forbidden - Logged in, but no permission
  404 Not Found - Resource doesn't exist
  422 Unprocessable Entity - Validation failed

5xx = Server Error
  500 Internal Server Error - Server crashed
  503 Service Unavailable - Server overloaded
```

---

### **4. API Request/Response**

**Request:**
```http
POST /api/orders HTTP/1.1
Host: api.flipkart.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "items": [
    {"product_id": 1, "quantity": 2}
  ],
  "payment_method": "UPI"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "order_id": 12345,
    "total_amount": 159998,
    "status": "processing"
  }
}
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Build Complete REST API** (45 mins)

```python
# api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database connection
def get_db():
    return psycopg2.connect(
        host="localhost",
        database="flipkart_db",
        user="postgres",
        password="your_password"
    )

# Helper: Standard response format
def api_response(success=True, data=None, message=None, status_code=200):
    response = {
        "success": success,
        "timestamp": datetime.now().isoformat()
    }
    if data is not None:
        response["data"] = data
    if message:
        response["message"] = message
    
    return jsonify(response), status_code

# Error handler
@app.errorhandler(404)
def not_found(error):
    return api_response(False, message="Endpoint not found", status_code=404)

@app.errorhandler(500)
def internal_error(error):
    return api_response(False, message="Internal server error", status_code=500)

# ============ PRODUCTS API ============

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filters"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        # Query parameters
        category = request.args.get('category')
        min_price = request.args.get('min_price', 0)
        max_price = request.args.get('max_price', 999999)
        search = request.args.get('search', '')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        # Build query
        query = """
            SELECT p.id, p.name, p.price, p.stock, c.name as category, p.rating
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.price BETWEEN %s AND %s
        """
        params = [min_price, max_price]
        
        if category:
            query += " AND c.name = %s"
            params.append(category)
        
        if search:
            query += " AND p.name ILIKE %s"
            params.append(f'%{search}%')
        
        query += " ORDER BY p.id LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cur.execute(query, params)
        products = []
        for row in cur.fetchall():
            products.append({
                "id": row[0],
                "name": row[1],
                "price": float(row[2]),
                "stock": row[3],
                "category": row[4],
                "rating": float(row[5]) if row[5] else 0
            })
        
        cur.close()
        conn.close()
        
        return api_response(data={"products": products, "count": len(products)})
    
    except Exception as e:
        return api_response(False, message=str(e), status_code=500)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT p.id, p.name, p.description, p.price, p.stock, 
                   c.name as category, p.rating
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = %s
        """, (product_id,))
        
        row = cur.fetchone()
        if not row:
            return api_response(False, message="Product not found", status_code=404)
        
        product = {
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": float(row[3]),
            "stock": row[4],
            "category": row[5],
            "rating": float(row[6]) if row[6] else 0
        }
        
        cur.close()
        conn.close()
        
        return api_response(data=product)
    
    except Exception as e:
        return api_response(False, message=str(e), status_code=500)

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create new product (admin only)"""
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['name', 'price', 'stock', 'category_id']
        for field in required_fields:
            if field not in data:
                return api_response(False, message=f"Missing field: {field}", status_code=400)
        
        if data['price'] < 0:
            return api_response(False, message="Price cannot be negative", status_code=400)
        
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO products (name, description, price, stock, category_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            data['name'],
            data.get('description', ''),
            data['price'],
            data['stock'],
            data['category_id']
        ))
        
        product_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        return api_response(
            data={"product_id": product_id},
            message="Product created successfully",
            status_code=201
        )
    
    except Exception as e:
        return api_response(False, message=str(e), status_code=500)

# ============ ORDERS API ============

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create new order"""
    try:
        data = request.get_json()
        
        # Validation
        if 'items' not in data or len(data['items']) == 0:
            return api_response(False, message="Order must have at least one item", status_code=400)
        
        conn = get_db()
        cur = conn.cursor()
        
        # Calculate total
        total_amount = 0
        for item in data['items']:
            cur.execute("SELECT price, stock FROM products WHERE id = %s", (item['product_id'],))
            product = cur.fetchone()
            
            if not product:
                return api_response(False, message=f"Product {item['product_id']} not found", status_code=404)
            
            price, stock = product
            quantity = item['quantity']
            
            if stock < quantity:
                return api_response(False, message=f"Insufficient stock for product {item['product_id']}", status_code=400)
            
            total_amount += float(price) * quantity
        
        # Create order
        cur.execute("""
            INSERT INTO orders (user_id, total_amount, status, payment_method, delivery_address)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            data.get('user_id', 1),  # TODO: Get from JWT token
            total_amount,
            'pending',
            data.get('payment_method', 'UPI'),
            data.get('delivery_address', 'Default address')
        ))
        
        order_id = cur.fetchone()[0]
        
        # Add order items
        for item in data['items']:
            cur.execute("SELECT price FROM products WHERE id = %s", (item['product_id'],))
            price = cur.fetchone()[0]
            
            cur.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (%s, %s, %s, %s)
            """, (order_id, item['product_id'], item['quantity'], price))
            
            # Update stock
            cur.execute("""
                UPDATE products SET stock = stock - %s WHERE id = %s
            """, (item['quantity'], item['product_id']))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return api_response(
            data={
                "order_id": order_id,
                "total_amount": total_amount,
                "status": "pending"
            },
            message="Order created successfully",
            status_code=201
        )
    
    except Exception as e:
        conn.rollback()
        return api_response(False, message=str(e), status_code=500)

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get order details"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        # Get order
        cur.execute("""
            SELECT o.id, o.total_amount, o.status, o.payment_method, 
                   o.created_at, u.full_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = %s
        """, (order_id,))
        
        order_row = cur.fetchone()
        if not order_row:
            return api_response(False, message="Order not found", status_code=404)
        
        # Get order items
        cur.execute("""
            SELECT p.name, oi.quantity, oi.price_at_purchase
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = %s
        """, (order_id,))
        
        items = []
        for row in cur.fetchall():
            items.append({
                "product_name": row[0],
                "quantity": row[1],
                "price": float(row[2])
            })
        
        order = {
            "id": order_row[0],
            "total_amount": float(order_row[1]),
            "status": order_row[2],
            "payment_method": order_row[3],
            "created_at": order_row[4].isoformat(),
            "customer_name": order_row[5],
            "items": items
        }
        
        cur.close()
        conn.close()
        
        return api_response(data=order)
    
    except Exception as e:
        return api_response(False, message=str(e), status_code=500)

# ============ HEALTH CHECK ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if API is running"""
    return api_response(data={"status": "healthy", "version": "1.0.0"})

# ============ RUN SERVER ============

if __name__ == '__main__':
    print("🚀 Starting Flipkart API Server...")
    print("📍 Base URL: http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  GET  /api/products")
    print("  GET  /api/products/<id>")
    print("  POST /api/products")
    print("  POST /api/orders")
    print("  GET  /api/orders/<id>")
    print("  GET  /api/health")
    print("\n Press Ctrl+C to stop\n")
    
    app.run(debug=True, port=5000)
```

**Install dependencies:**
```bash
pip install Flask flask-cors psycopg2-binary
```

**Run API:**
```bash
python api_server.py
```

---

### **Task 2: Test API with cURL/Python** (20 mins)

**Create test client:**

```python
# test_api.py
import requests
import json

BASE_URL = "http://localhost:5000/api"

print("=== API TESTING ===\n")

# 1. Health check
response = requests.get(f"{BASE_URL}/health")
print("1. Health Check:")
print(f"   Status: {response.status_code}")
print(f"   Data: {response.json()}\n")

# 2. Get all products
response = requests.get(f"{BASE_URL}/products")
print("2. Get Products:")
print(f"   Status: {response.status_code}")
data = response.json()
print(f"   Found {data['data']['count']} products\n")

# 3. Search products
response = requests.get(f"{BASE_URL}/products?search=iPhone&limit=5")
print("3. Search 'iPhone':")
products = response.json()['data']['products']
for p in products:
    print(f"   {p['name']:30} ₹{p['price']:,}")

# 4. Get single product
response = requests.get(f"{BASE_URL}/products/1")
print("\n4. Get Product #1:")
if response.status_code == 200:
    product = response.json()['data']
    print(f"   {product['name']} - ₹{product['price']:,}")
    print(f"   Stock: {product['stock']}")

# 5. Create product
new_product = {
    "name": "Test Product",
    "description": "API test product",
    "price": 999,
    "stock": 100,
    "category_id": 1
}

response = requests.post(
    f"{BASE_URL}/products",
    json=new_product,
    headers={"Content-Type": "application/json"}
)

print("\n5. Create Product:")
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    product_id = response.json()['data']['product_id']
    print(f"   Created product ID: {product_id}")

# 6. Create order
new_order = {
    "user_id": 1,
    "items": [
        {"product_id": 1, "quantity": 1}
    ],
    "payment_method": "UPI",
    "delivery_address": "123 Test Street, Bangalore"
}

response = requests.post(
    f"{BASE_URL}/orders",
    json=new_order
)

print("\n6. Create Order:")
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    order_data = response.json()['data']
    print(f"   Order ID: {order_data['order_id']}")
    print(f"   Total: ₹{order_data['total_amount']:,}")
    
    # Get order details
    order_id = order_data['order_id']
    response = requests.get(f"{BASE_URL}/orders/{order_id}")
    if response.status_code == 200:
        order = response.json()['data']
        print(f"   Status: {order['status']}")
        print(f"   Items:")
        for item in order['items']:
            print(f"     - {item['product_name']} x{item['quantity']}")

print("\n✅ API tests complete!")
```

**Run:**
```bash
python test_api.py
```

---

### **Task 3: API Documentation with Swagger** (15 mins)

```python
# Add to api_server.py
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/api/products', methods=['GET'])
def get_products():
    """
    Get all products
    ---
    parameters:
      - name: search
        in: query
        type: string
        required: false
        description: Search by product name
      - name: category
        in: query
        type: string
        required: false
      - name: min_price
        in: query
        type: number
      - name: max_price
        in: query
        type: number
      - name: limit
        in: query
        type: integer
        default: 20
    responses:
      200:
        description: List of products
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
              properties:
                products:
                  type: array
                count:
                  type: integer
    """
    # ... (existing code)
```

**Install:** `pip install flasgger`

**Access:** `http://localhost:5000/apidocs`

---

## ✅ Verification Checklist

Before Day 20:

- [ ] Built complete REST API with CRUD operations
- [ ] Understand HTTP methods and status codes
- [ ] Implemented error handling and validation
- [ ] Can test APIs with Postman/cURL/Python
- [ ] Understand API design best practices
- [ ] Know how to document APIs

---

## 📖 Resources

- **REST API Design:** [restfulapi.net](https://restfulapi.net/)
- **Flask Docs:** [flask.palletsprojects.com](https://flask.palletsprojects.com/)
- **Postman:** [postman.com](https://www.postman.com/) - API testing tool

---

## 🚀 Wrap Up

Tomorrow: **Day 20 - Authentication & Security** (JWT, password hashing, API security - FINAL DAY OF MODULE 4!)

[← Day 18: NoSQL](./Day%2018%20-%20NoSQL%20Databases.md) | [Day 20: Auth & Security →](./Day%2020%20-%20User%20Authentication%20&%20Security.md)
