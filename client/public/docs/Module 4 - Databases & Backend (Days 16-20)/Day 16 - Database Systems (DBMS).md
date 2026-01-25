# 📅 Day 16: Database Systems - The Heart of Every App

**Module:** Databases & Backend (Days 16-20)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - foundational but complex)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- What databases are and why we need them
- SQL vs NoSQL - when to use each
- Database fundamentals (ACID, Transactions, Indexing)
- How Flipkart/Paytm store millions of records
- Design your first database schema

**Real-world relevance:** Every app needs data storage. Flipkart has 500M+ products, Paytm processes 2B+ transactions. Databases make this possible!

---

## 📚 Theory (45-60 minutes)

### **1. Why Databases? The Problem They Solve**

**Without Database (File Storage):**
```
users.txt:
rajesh,rajesh@mail.com,pass123
priya,priya@mail.com,test456

Problems:
❌ No concurrent access (corruption if 2 people write)
❌ No search optimization (read entire file)
❌ No data integrity (can save corrupted data)
❌ No relationships (how to link orders to users?)
```

**With Database:**
```sql
-- Concurrent access ✅
-- Indexed search (instant) ✅
-- Data validation ✅
-- Relationships ✅
SELECT * FROM users WHERE email = 'rajesh@mail.com';
-- Returns in milliseconds even with 100M users!
```

---

### **2. SQL vs NoSQL - The Great Divide**

#### **SQL (Relational Databases)**

```
Structured tables with strict schema

Users Table:
| id | name   | email              |
|----|--------|-------------------|
| 1  | Rajesh | rajesh@example.com |
| 2  | Priya  | priya@example.com  |

Orders Table:
| id | user_id | amount | status    |
|----|---------|--------|-----------|
| 1  | 1       | 1500   | delivered |
| 2  | 1       | 800    | pending   |
```

**Examples:** PostgreSQL, MySQL, SQLite  
**Use When:** Banking, E-commerce, CRM (structured data, relationships)

---

#### **NoSQL (Non-Relational)**

```json
// Document store (MongoDB)
{
  "_id": "user_1",
  "name": "Rajesh",
  "email": "rajesh@example.com",
  "orders": [
    {"amount": 1500, "status": "delivered"},
    {"amount": 800, "status": "pending"}
  ],
  "preferences": {
    "language": "Hindi",
    "notifications": true
  }
}
```

**Examples:** MongoDB, Redis, Cassandra  
**Use When:** Social media, Real-time analytics, IoT (flexible schema, scale)

---

**Comparison Table:**

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Schema** | Fixed (strict) | Flexible (dynamic) |
| **Relationships** | Strong (JOINs) | Weak (embedded docs) |
| **ACID** | Full support | Limited (eventual consistency) |
| **Scale** | Vertical (bigger server) | Horizontal (more servers) |
| **Use Case** | Banking, E-commerce | Social media, Real-time |
| **Query Language** | SQL (standard) | Varies by DB |
| **Indian Example** | ICICI Bank, Flipkart orders | Ola cab tracking, Twitter |

---

### **3. ACID Properties - Database Guarantees**

**Banking Example (UPI Transfer):**

#### **A - Atomicity (All or Nothing)**
```
Transfer ₹1000 from Rajesh to Priya:
1. Deduct ₹1000 from Rajesh
2. Add ₹1000 to Priya

If power fails after step 1? 
→ ROLLBACK both steps! No partial transfer.
```

#### **C - Consistency (Valid State)**
```
Balance cannot be negative
Account ID must exist
Amount > 0

Database enforces these rules!
```

#### **I - Isolation (Transactions Don't Interfere)**
```
Transaction 1: Rajesh transfers ₹1000 to Priya
Transaction 2: Amit transfers ₹500 to Rajesh

Both happen simultaneously without corruption!
```

#### **D - Durability (Permanent)**
```
Once transaction commits → guaranteed saved
Even if server crashes next second!
```

---

### **4. Database Concepts**

#### **Primary Key**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Unique identifier
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100)
);

-- id auto-increments: 1, 2, 3...
```

#### **Foreign Key (Relationships)**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),  -- Foreign key!
    amount DECIMAL(10, 2)
);

-- Links order to user
```

#### **Indexes (Speed Up Searches)**
```sql
-- Without index:
SELECT * FROM users WHERE email = 'rajesh@mail.com';
-- Scans all 10M users → SLOW!

-- With index:
CREATE INDEX idx_email ON users(email);
-- Binary search → finds in milliseconds!
```

#### **Transactions**
```sql
BEGIN;
    UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
    UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;  -- Both or neither!
```

---

### **5. Database Design - ER Diagram**

**Flipkart E-commerce Schema:**

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│  Users  │────1:N──│  Orders  │────N:M──│ Products │
└─────────┘         └──────────┘         └──────────┘
│                   │                    │
├─ id (PK)          ├─ id (PK)           ├─ id (PK)
├─ email            ├─ user_id (FK)      ├─ name
├─ password_hash    ├─ total_amount      ├─ price
├─ phone            ├─ status            ├─ stock
└─ created_at       └─ created_at        └─ category

Relationships:
1:N - One user has many orders
N:M - Many orders contain many products (junction table needed)
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Setup PostgreSQL & First Database** (20 mins)

**Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Mac
brew install postgresql

# Windows: Download installer from postgresql.org

# Start service
sudo service postgresql start  # Linux
brew services start postgresql  # Mac
```

**Create database:**
```bash
# Switch to postgres user
sudo -u postgres psql

# Or directly:
psql -U postgres

# PostgreSQL prompt:
postgres=# CREATE DATABASE flipkart_db;
postgres=# \c flipkart_db
postgres=# \q  -- Quit
```

**Python Connection:**
```bash
pip install psycopg2-binary
```

```python
# db_connection.py
import psycopg2

# Connect
conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)

# Create cursor
cur = conn.cursor()

# Execute query
cur.execute("SELECT version();")
version = cur.fetchone()
print(f"PostgreSQL version: {version[0]}")

# Close
cur.close()
conn.close()
```

---

### **Task 2: Design E-commerce Database** (30 mins)

**Create comprehensive schema:**

```python
# create_schema.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

# Users table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Categories table
cur.execute("""
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
""")

# Products table
cur.execute("""
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Orders table
cur.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('UPI', 'Card', 'COD', 'NetBanking')),
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Order Items (junction table for many-to-many)
cur.execute("""
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    UNIQUE(order_id, product_id)
);
""")

# Reviews table
cur.execute("""
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)  -- One review per user per product
);
""")

# Create indexes for performance
cur.execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);")

conn.commit()
print("✅ Database schema created successfully!")

cur.close()
conn.close()
```

**Run:**
```bash
python create_schema.py
```

---

### **Task 3: Insert Sample Data** (20 mins)

```python
# insert_data.py
import psycopg2
from datetime import datetime

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

# Insert users
users_data = [
    ('rajesh@example.com', 'hashed_pass_1', 'Rajesh Kumar', '9876543210'),
    ('priya@example.com', 'hashed_pass_2', 'Priya Sharma', '9876543211'),
    ('amit@example.com', 'hashed_pass_3', 'Amit Patel', '9876543212'),
]

cur.executemany("""
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (email) DO NOTHING
""", users_data)

# Insert categories
categories = [
    ('Electronics', 'Electronic devices and accessories'),
    ('Clothing', 'Apparel and fashion'),
    ('Books', 'Books and literature'),
    ('Home & Kitchen', 'Home appliances and kitchen items'),
]

cur.executemany("""
    INSERT INTO categories (name, description)
    VALUES (%s, %s)
    ON CONFLICT (name) DO NOTHING
""", categories)

# Get category IDs
cur.execute("SELECT id FROM categories WHERE name = 'Electronics'")
electronics_id = cur.fetchone()[0]

cur.execute("SELECT id FROM categories WHERE name = 'Clothing'")
clothing_id = cur.fetchone()[0]

# Insert products
products = [
    ('iPhone 15', 'Latest Apple smartphone', 79999.00, 50, electronics_id, 4.5),
    ('Samsung Galaxy S24', 'Samsung flagship phone', 74999.00, 30, electronics_id, 4.3),
    ('OnePlus 11', 'OnePlus premium phone', 56999.00, 40, electronics_id, 4.4),
    ('Nike Running Shoes', 'Comfortable running shoes', 5999.00, 100, clothing_id, 4.2),
    ('Adidas T-Shirt', 'Sports t-shirt', 1499.00, 200, clothing_id, 4.0),
]

cur.executemany("""
    INSERT INTO products (name, description, price, stock, category_id, rating)
    VALUES (%s, %s, %s, %s, %s, %s)
""", products)

# Get user and product IDs for order
cur.execute("SELECT id FROM users WHERE email = 'rajesh@example.com'")
user_id = cur.fetchone()[0]

cur.execute("SELECT id FROM products WHERE name = 'iPhone 15'")
iphone_id = cur.fetchone()[0]

cur.execute("SELECT id FROM products WHERE name = 'Nike Running Shoes'")
shoes_id = cur.fetchone()[0]

# Create order
cur.execute("""
    INSERT INTO orders (user_id, total_amount, status, payment_method, delivery_address)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id
""", (user_id, 85998.00, 'processing', 'UPI', '123 MG Road, Bangalore, Karnataka 560001'))

order_id = cur.fetchone()[0]

# Add order items
order_items = [
    (order_id, iphone_id, 1, 79999.00),
    (order_id, shoes_id, 1, 5999.00),
]

cur.executemany("""
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    VALUES (%s, %s, %s, %s)
""", order_items)

conn.commit()
print("✅ Sample data inserted successfully!")

# Verify
cur.execute("SELECT COUNT(*) FROM users")
print(f"Users: {cur.fetchone()[0]}")

cur.execute("SELECT COUNT(*) FROM products")
print(f"Products: {cur.fetchone()[0]}")

cur.execute("SELECT COUNT(*) FROM orders")
print(f"Orders: {cur.fetchone()[0]}")

cur.close()
conn.close()
```

---

### **Task 4: Database Queries & Analysis** (25 mins)

```python
# queries.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

print("=== Database Analysis ===\n")

# 1. Total revenue
cur.execute("SELECT SUM(total_amount) FROM orders WHERE status != 'cancelled'")
revenue = cur.fetchone()[0]
print(f"1. Total Revenue: ₹{revenue:,.2f}\n")

# 2. Most expensive products
cur.execute("""
    SELECT name, price, stock 
    FROM products 
    ORDER BY price DESC 
    LIMIT 5
""")
print("2. Top 5 Most Expensive Products:")
for row in cur.fetchall():
    print(f"   {row[0]:30} ₹{row[1]:>10,.2f} (Stock: {row[2]})")

# 3. User order history
cur.execute("""
    SELECT u.full_name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.full_name
    ORDER BY total_spent DESC NULLS LAST
""")
print("\n3. User Purchase Summary:")
for row in cur.fetchall():
    total = row[2] if row[2] else 0
    print(f"   {row[0]:20} Orders: {row[1]:3} Total: ₹{total:>10,.2f}")

# 4. Products by category
cur.execute("""
    SELECT c.name, COUNT(p.id) as product_count, AVG(p.price) as avg_price
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
    ORDER BY product_count DESC
""")
print("\n4. Category Analysis:")
for row in cur.fetchall():
    avg = row[2] if row[2] else 0
    print(f"   {row[0]:20} Products: {row[1]:3} Avg Price: ₹{avg:>10,.2f}")

# 5. Order details with JOIN
cur.execute("""
    SELECT 
        o.id,
        u.full_name,
        o.total_amount,
        o.status,
        o.payment_method,
        STRING_AGG(p.name, ', ') as products
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, u.full_name, o.total_amount, o.status, o.payment_method
    ORDER BY o.created_at DESC
""")
print("\n5. Recent Orders with Details:")
for row in cur.fetchall():
    print(f"   Order #{row[0]:3} | {row[1]:15} | ₹{row[2]:>10,.2f} | {row[3]:10} | {row[4]:10}")
    print(f"        Products: {row[5]}")

# 6. Low stock alert
cur.execute("""
    SELECT name, stock, price
    FROM products
    WHERE stock < 50
    ORDER BY stock ASC
""")
print("\n6. Low Stock Alert (< 50 units):")
for row in cur.fetchall():
    print(f"   ⚠️  {row[0]:30} Stock: {row[1]:3} Price: ₹{row[2]:>10,.2f}")

cur.close()
conn.close()
```

---

### **Task 5: Transactions & ACID Demo** (20 mins)

```python
# transactions_demo.py
import psycopg2

def transfer_money(from_user_email, to_user_email, amount):
    """Simulate UPI transfer with ACID guarantees"""
    conn = psycopg2.connect(
        host="localhost",
        database="flipkart_db",
        user="postgres",
        password="your_password"
    )
    
    try:
        cur = conn.cursor()
        
        # START TRANSACTION (implicit with psycopg2)
        
        # Get user IDs and balances (assuming we add balance column)
        # First, add balance column if not exists
        cur.execute("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='balance'
                ) THEN
                    ALTER TABLE users ADD COLUMN balance DECIMAL(10, 2) DEFAULT 5000.00;
                END IF;
            END $$;
        """)
        
        # Check sender balance
        cur.execute("""
            SELECT id, balance FROM users WHERE email = %s FOR UPDATE
        """, (from_user_email,))
        
        sender = cur.fetchone()
        if not sender:
            raise Exception(f"Sender {from_user_email} not found")
        
        sender_id, sender_balance = sender
        
        if sender_balance < amount:
            raise Exception(f"Insufficient balance! Has ₹{sender_balance}, needs ₹{amount}")
        
        # Check receiver exists
        cur.execute("""
            SELECT id FROM users WHERE email = %s FOR UPDATE
        """, (to_user_email,))
        
        receiver = cur.fetchone()
        if not receiver:
            raise Exception(f"Receiver {to_user_email} not found")
        
        receiver_id = receiver[0]
        
        # Deduct from sender
        cur.execute("""
            UPDATE users SET balance = balance - %s WHERE id = %s
        """, (amount, sender_id))
        
        # Simulate potential failure point
        # import random
        # if random.random() < 0.3:  # 30% chance of failure
        #     raise Exception("Network error!")
        
        # Add to receiver
        cur.execute("""
            UPDATE users SET balance = balance + %s WHERE id = %s
        """, (amount, receiver_id))
        
        # COMMIT TRANSACTION
        conn.commit()
        
        print(f"✅ Transfer successful!")
        print(f"   ₹{amount} transferred from {from_user_email} to {to_user_email}")
        
        return True
        
    except Exception as e:
        # ROLLBACK on any error
        conn.rollback()
        print(f"❌ Transfer failed: {e}")
        print(f"   Transaction rolled back - no money lost!")
        return False
        
    finally:
        cur.close()
        conn.close()

# Test
print("=== UPI Transfer Simulation ===\n")
print("Initial balances:")

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()
cur.execute("SELECT email, balance FROM users ORDER BY email")
for row in cur.fetchall():
    print(f"  {row[0]:25} ₹{row[1]:>10,.2f}")
cur.close()
conn.close()

print("\n--- Attempting transfer ---")
transfer_money('rajesh@example.com', 'priya@example.com', 1000)

print("\nFinal balances:")
conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()
cur.execute("SELECT email, balance FROM users ORDER BY email")
for row in cur.fetchall():
    print(f"  {row[0]:25} ₹{row[1]:>10,.2f}")
cur.close()
conn.close()
```

---

## ✅ Verification Checklist

Before moving to Day 17:

- [ ] Understand SQL vs NoSQL differences
- [ ] Can explain ACID properties
- [ ] Created database schema with relationships
- [ ] Inserted and queried data using Python
- [ ] Understand Primary Key, Foreign Key, Index
- [ ] Executed JOIN queries
- [ ] Implemented transaction (rollback on failure)

**Self-Test:** Design a database schema for a Paytm wallet system

---

## 📖 Resources

- **PostgreSQL Docs:** [postgresql.org/docs](https://www.postgresql.org/docs/)
- **DB Design Tool:** [dbdiagram.io](https://dbdiagram.io/)  
- **SQL Practice:** [sqlzoo.net](https://sqlzoo.net/)

---

## 💡 Connection to Future Roles

| Role | Database Usage |
|------|----------------|
| **Backend Developer** | Design schemas, optimize queries daily |
| **Full Stack** | Connect frontend to database via APIs |
| **Data Engineer** | Build data pipelines, optimize storage |
| **DevOps** | Database backups, replication, scaling |

---

## 🚀 Wrap Up

**Congratulations on completing Day 16!** 🎉

Tomorrow: **Day 17 - SQL Mastery** (advanced queries, optimization, real-world scenarios!)

[← Day 15: Package Management](../Module%203%20-%20Software%20Engineering%20Tools%20(Days%2011-15)/Day%2015%20-%20Package%20Management.md) | [Day 17: SQL Mastery →](./Day%2017%20-%20SQL%20Mastery.md)
