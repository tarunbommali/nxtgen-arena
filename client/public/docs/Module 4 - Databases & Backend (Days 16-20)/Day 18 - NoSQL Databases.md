# 📅 Day 18: NoSQL Databases - Beyond Tables

**Module:** Databases & Backend (Days 16-20)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - new paradigm)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- When to use NoSQL over SQL
- MongoDB (Document Store) - the most popular NoSQL
- Redis (Key-Value Store) - caching and real-time data
- Design schema-less data models
- Combine SQL + NoSQL in real applications

**Real-world relevance:** Facebook uses Cassandra, Twitter uses Redis, Netflix uses MongoDB. Modern apps use BOTH SQL and NoSQL!

---

## 📚 Theory (30-45 minutes)

### **1. NoSQL Types**

```
Document Store (MongoDB) → JSON-like documents
Key-Value (Redis) → Simple key: value pairs
Column-Family (Cassandra) → Wide columns
Graph (Neo4j) → Nodes and relationships
```

**When to Use NoSQL:**
- ✅ Rapid development (schema changes frequently)
- ✅ Massive scale (millions of users)
- ✅ Real-time analytics
- ✅ Caching layer
- ✅ Flexible data (each document can be different)

**When to Use SQL:**
- ✅ Complex relationships (e-commerce orders)
- ✅ ACID transactions (banking)
- ✅ Structured data (accounting)
- ✅ Reporting & analytics with JOINs

---

### **2. MongoDB - Document Store**

**PostgreSQL:**
```sql
users Table:
| id | name   | email        |
|----|--------|--------------|
| 1  | Rajesh | raj@mail.com |

orders Table:
| id | user_id | amount |
|----|---------|--------|
| 1  | 1       | 5000   |
```

**MongoDB:**
```json
{
  "_id": "user_1",
  "name": "Rajesh",
  "email": "raj@mail.com",
  "orders": [
    {"amount": 5000, "status": "delivered"},
    {"amount": 3000, "status": "pending"}
  ],
  "preferences": {
    "language": "Hindi",
    "notifications": true
  }
}
```

**Advantages:**
- No need for JOINs (data embedded)
- Schema-less (add fields anytime)
- Scales horizontally (add more servers)

---

### **3. Redis - Key-Value Store**

**In-Memory Database (FAST!)**

```
Key                    Value
-------------------    ---------------
user:1:session         {token: "abc123", expires: 3600}
product:iphone:stock   50
cache:homepage         <HTML content>
```

**Use Cases:**
- ✅ Session storage (login tokens)
- ✅ Caching (avoid database hits)
- ✅ Real-time leaderboards
- ✅ Rate limiting
- ✅ Pub/Sub messaging

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: MongoDB Setup & CRUD** (30 mins)

**Install MongoDB:**
```bash
# Ubuntu
sudo apt install mongodb

# Mac
brew install mongodb-community

# Start MongoDB
mongod --dbpath /data/db

# Or use MongoDB Atlas (cloud, free tier)
# atlas.mongodb.com
```

**Python with MongoDB:**
```bash
pip install pymongo
```

**Create E-commerce with MongoDB:**

```python
# mongodb_crud.py
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# Connect
client = MongoClient('mongodb://localhost:27017/')
db = client['flipkart_nosql']

# Collections (like tables in SQL)
users = db['users']
products = db['products']
orders = db['orders']

print("=== MongoDB E-COMMERCE ===\n")

# 1. INSERT - Create users
user_docs = [
    {
        "email": "rajesh@example.com",
        "full_name": "Rajesh Kumar",
        "phone": "9876543210",
        "address": {
            "street": "123 MG Road",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560001"
        },
        "preferences": {
            "language": "Hindi",
            "notifications": True
        },
        "created_at": datetime.now()
    },
    {
        "email": "priya@example.com",
        "full_name": "Priya Sharma",
        "phone": "9876543211",
        "address": {
            "street": "45 Park Street",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001"
        },
        "preferences": {
            "language": "English",
            "notifications": False
        },
        "created_at": datetime.now()
    }
]

# Insert multiple
result = users.insert_many(user_docs)
print(f"1. Inserted {len(result.inserted_ids)} users")

# 2. INSERT - Products
product_docs = [
    {
        "name": "iPhone 15",
        "price": 79999,
        "category": "Electronics",
        "stock": 50,
        "specs": {
            "brand": "Apple",
            "storage": "128GB",
            "color": "Black"
        },
        "ratings": [5, 4, 5, 5, 4],  # Array of ratings
        "tags": ["smartphone", "5g", "premium"],
        "created_at": datetime.now()
    },
    {
        "name": "Nike Running Shoes",
        "price": 5999,
        "category": "Fashion",
        "stock": 100,
        "specs": {
            "brand": "Nike",
            "size": "9",
            "color": "Blue"
        },
        "ratings": [4, 4, 3, 5],
        "tags": ["shoes", "sports", "running"],
        "created_at": datetime.now()
    }
]

products.insert_many(product_docs)
print(f"2. Inserted {len(product_docs)} products")

# 3. FIND - Query documents
print("\n3. FINDING USERS:")
for user in users.find():
    print(f"   {user['full_name']:20} | {user['email']}")

# 4. FIND with filter
print("\n4. PRODUCTS IN ELECTRONICS:")
for product in products.find({"category": "Electronics"}):
    print(f"   {product['name']:20} | ₹{product['price']:,}")

# 5. FIND with projection (select specific fields)
print("\n5. PRODUCT NAMES ONLY:")
for product in products.find({}, {"name": 1, "price": 1, "_id": 0}):
    print(f"   {product['name']:20} | ₹{product['price']:,}")

# 6. UPDATE - Modify document
users.update_one(
    {"email": "rajesh@example.com"},
    {"$set": {"preferences.notifications": False}}
)
print("\n6. Updated Rajesh's notification preferences")

# 7. UPDATE - Add to array
products.update_one(
    {"name": "iPhone 15"},
    {"$push": {"ratings": 5}}  # Add new rating
)
print("7. Added new rating to iPhone")

# 8. DELETE
products.delete_one({"name": "Test Product"})  # Won't delete anything (doesn't exist)
print("8. Delete operation complete")

# 9. AGGREGATION - Calculate average rating
pipeline = [
    {"$unwind": "$ratings"},  # Flatten ratings array
    {"$group": {
        "_id": "$name",
        "avg_rating": {"$avg": "$ratings"},
        "total_ratings": {"$sum": 1}
    }},
    {"$sort": {"avg_rating": -1}}
]

print("\n9. PRODUCT RATINGS (Aggregation):")
for result in products.aggregate(pipeline):
    print(f"   {result['_id']:20} | ⭐ {result['avg_rating']:.2f} ({result['total_ratings']} reviews)")

# 10. CREATE ORDER (embedded document)
rajesh = users.find_one({"email": "rajesh@example.com"})
iphone = products.find_one({"name": "iPhone 15"})

order_doc = {
    "user_id": rajesh['_id'],
    "user_email": rajesh['email'],  # Denormalization!
    "items": [
        {
            "product_id": iphone['_id'],
            "product_name": iphone['name'],  # Denormalize for speed
            "price": iphone['price'],
            "quantity": 1
        }
    ],
    "total_amount": iphone['price'],
    "status": "processing",
    "payment": {
        "method": "UPI",
        "upi_id": "rajesh@paytm",
        "transaction_id": "UPI123456"
    },
    "delivery_address": rajesh['address'],
    "created_at": datetime.now()
}

orders.insert_one(order_doc)
print("\n10. Created order with embedded user and product data")

client.close()
print("\n✅ MongoDB operations complete!")
```

---

### **Task 2: Redis Caching Layer** (25 mins)

**Install Redis:**
```bash
# Ubuntu
sudo apt install redis-server
sudo service redis-server start

# Mac
brew install redis
brew services start redis

# Python
pip install redis
```

**Implement Caching:**

```python
# redis_cache.py
import redis
import json
import time
from datetime import timedelta

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

print("=== REDIS CACHING DEMO ===\n")

# 1. Simple key-value
r.set('username', 'Rajesh Kumar')
username = r.get('username')
print(f"1. Stored username: {username}")

# 2. Set with expiry (TTL)
r.setex('session:rajesh', timedelta(hours=1), 'session_token_abc123')
print(f"2. Session stored with 1-hour expiry")
print(f"   TTL: {r.ttl('session:rajesh')} seconds remaining")

# 3. Store complex data (JSON)
user_data = {
    "id": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "balance": 5000
}
r.set('user:1', json.dumps(user_data))
cached_user = json.loads(r.get('user:1'))
print(f"\n3. Cached user: {cached_user['name']} (₹{cached_user['balance']})")

# 4. Increment/Decrement (atomic operations)
r.set('product:iphone:stock', 50)
r.decr('product:iphone:stock')  # Decrement by 1
r.decr('product:iphone:stock', 5)  # Decrement by 5
stock = r.get('product:iphone:stock')
print(f"\n4. iPhone stock after 6 sales: {stock}")

# 5. Lists (for queues)
r.rpush('order_queue', 'order_1')
r.rpush('order_queue', 'order_2')
r.rpush('order_queue', 'order_3')

print(f"\n5. Order queue:")
while True:
    order = r.lpop('order_queue')
    if not order:
        break
    print(f"   Processing: {order}")

# 6. Sets (unique items)
r.sadd('user:1:cart', 'product_1', 'product_2', 'product_3')
r.sadd('user:2:cart', 'product_2', 'product_4')

# Find common items
common = r.sinter('user:1:cart', 'user:2:cart')
print(f"\n6. Products in both carts: {common}")

# 7. Sorted Sets (leaderboard)
r.zadd('leaderboard', {'Rajesh': 1500, 'Priya': 2000, 'Amit': 1200})
r.zincrby('leaderboard', 500, 'Rajesh')  # Add 500 points

print(f"\n7. Top 3 Leaderboard:")
for idx, (user, score) in enumerate(r.zrevrange('leaderboard', 0, 2, withscores=True), 1):
    print(f"   {idx}. {user:15} {int(score):,} points")

# 8. Rate limiting example
def check_rate_limit(user_id, limit=5, window=60):
    """Allow max 5 requests per 60 seconds"""
    key = f"rate_limit:{user_id}"
    current = r.get(key)
    
    if current is None:
        r.setex(key, window, 1)
        return True, 1
    
    if int(current) >= limit:
        return False, int(current)
    
    r.incr(key)
    return True, int(current) + 1

print(f"\n8. RATE LIMITING (max 5 requests/min):")
for i in range(7):
    allowed, count = check_rate_limit('user_1')
    status = "✅ ALLOWED" if allowed else "❌ BLOCKED"
    print(f"   Request {i+1}: {status} (count: {count})")

# 9. Pub/Sub (simple example)
print(f"\n9. Pub/Sub (Publisher-Subscriber):")
r.publish('notifications', json.dumps({
    'user_id': 1,
    'message': 'Your order has been shipped!',
    'timestamp': str(time.time())
}))
print("   Published notification to 'notifications' channel")

# 10. Cache performance demo
def get_user_expensive(user_id):
    """Simulate slow database query"""
    time.sleep(0.5)  # Slow query
    return {"id": user_id, "name": f"User {user_id}"}

print(f"\n10. CACHE PERFORMANCE:")

# Without cache
start = time.time()
user = get_user_expensive(1)
no_cache_time = time.time() - start
print(f"    Without cache: {no_cache_time:.3f}s")

# With cache
cache_key = 'user:1:cached'
cached_data = r.get(cache_key)

if cached_data:
    start = time.time()
    user = json.loads(cached_data)
    with_cache_time = time.time() - start
    print(f"    With cache: {with_cache_time:.6f}s")
    print(f"    ⚡ {no_cache_time/with_cache_time:.0f}x faster!")
else:
    user = get_user_expensive(1)
    r.setex(cache_key, 300, json.dumps(user))  # Cache for 5 minutes
    print("    Cached for future requests")

print("\n✅ Redis operations complete!")
```

---

###Task 3: SQL + NoSQL Hybrid** (20 mins)

**Real-world architecture:**

```python
# hybrid_architecture.py
import psycopg2
from pymongo import MongoClient
import redis
import json

# Connect to all databases
postgres_conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)

mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['flipkart_nosql']

redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

print("=== HYBRID DATABASE ARCHITECTURE ===\n")

# Use case: E-commerce product page
def get_product_details(product_id):
    """
    PostgreSQL: Core product data (price, stock)
    MongoDB: Product reviews (flexible schema)
    Redis: Cache frequently accessed products
    """
    
    cache_key = f"product:{product_id}:details"
    
    # 1. Try Redis cache first
    cached = redis_client.get(cache_key)
    if cached:
        print(f"✓ Loaded from Redis cache")
        return json.loads(cached)
    
    # 2. Load from PostgreSQL (core data)
    pg_cur = postgres_conn.cursor()
    pg_cur.execute("""
        SELECT name, price, stock, category_id
        FROM products
        WHERE id = %s
    """, (product_id,))
    
    product_data = pg_cur.fetchone()
    if not product_data:
        return None
    
    product = {
        "id": product_id,
        "name": product_data[0],
        "price": float(product_data[1]),
        "stock": product_data[2],
        "category_id": product_data[3]
    }
    
    # 3. Load reviews from MongoDB (flexible, unstructured)
    reviews_collection = mongo_db['reviews']
    reviews = list(reviews_collection.find(
        {"product_id": product_id},
        {"_id": 0, "user_name": 1, "rating": 1, "comment": 1}
    ).limit(10))
    
    product['reviews'] = reviews
    product['avg_rating'] = sum([r['rating'] for r in reviews]) / len(reviews) if reviews else 0
    
    # 4. Cache in Redis for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(product))
    
    print(f"✓ Loaded from PostgreSQL + MongoDB, cached in Redis")
    return product

# Test
product = get_product_details(1)
if product:
    print(f"\n{product['name']}")
    print(f"Price: ₹{product['price']:,}")
    print(f"Stock: {product['stock']}")
    print(f"Avg Rating: ⭐ {product['avg_rating']:.2f}")

# Second call (from cache)
product = get_product_details(1)

mongo_client.close()
postgres_conn.close()
print("\n✅ Hybrid architecture demo complete!")
```

**Architecture Benefits:**
- **PostgreSQL:** ACID transactions for orders, inventory
- **MongoDB:** Flexible product catalogs, user-generated content
- **Redis:** Sub-millisecond cache responses

---

## ✅ Verification Checklist

Before Day 19:

- [ ] Understand when to use NoSQL over SQL
- [ ] Can perform CRUD operations in MongoDB
- [ ] Use Redis for caching and sessions
- [ ] Understand document-based data modeling
- [ ] Know how to combine SQL + NoSQL
- [ ] Can implement rate limiting with Redis
- [ ] Understand trade-offs (consistency vs availability)

**Self-Test:** Design a database architecture for Instagram (users, posts, likes, comments)

---

## 📖 Resources

- **MongoDB University:** [learn.mongodb.com](https://learn.mongodb.com/) (Free courses)
- **Redis University:** [university.redis.com](https://university.redis.com/)
- **Try Redis:** [try.redis.io](https://try.redis.io/)

---

## 🚀 Wrap Up

**Congratulations on completing Day 18!** 🎉

Tomorrow: **Day 19 - API Architecture** (Build REST APIs with Flask!)

[← Day 17: SQL Mastery](./Day%2017%20-%20SQL%20Mastery.md) | [Day 19: APIs →](./Day%2019%20-%20API%20Architecture.md)
