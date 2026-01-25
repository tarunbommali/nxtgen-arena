# 📅 Day 17: SQL Mastery - Query Like a Pro

**Module:** Databases & Backend (Days 16-20)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - requires practice)

---

## 🎯 Today's Objectives

By end of today, you will master:
- Complex SQL queries (JOINs, subqueries, aggregations)
- Query optimization and indexing
- Common Table Expressions (CTEs) and Window Functions
- Real-world analytics queries
- SQL best practices for production

**Real-world relevance:** Backend developers write 10-50 SQL queries daily. Flipkart's recommendation engine, Paytm's fraud detection - all powered by SQL!

---

## 📚 Theory (30-45 minutes)

### **1. SQL Query Execution Order**

```sql
SELECT column          -- 5. Finally select columns
FROM table             -- 1. Start from table
WHERE condition        -- 2. Filter rows
GROUP BY column        -- 3. Group rows
HAVING condition       -- 4. Filter groups
ORDER BY column        -- 6. Sort results
LIMIT 10;              -- 7. Limit output
```

**Understanding this = writing better queries!**

---

### **2. JOINs - Combining Tables**

#### **INNER JOIN (Most Common)**
```sql
-- Get orders with customer names
SELECT o.id, u.full_name, o.total_amount
FROM orders o
INNER JOIN users u ON o.user_id = u.id;

-- Returns only matching rows from both tables
```

#### **LEFT JOIN (Keep All Left Rows)**
```sql
-- Get all users, even those without orders
SELECT u.full_name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.full_name;

-- Users without orders will show count = 0
```

#### **RIGHT JOIN**
```sql
-- Rarely used (just reverse LEFT JOIN)
SELECT *
FROM orders o
RIGHT JOIN users u ON o.user_id = u.id;
```

#### **FULL OUTER JOIN**
```sql
-- All rows from both tables (rare in practice)
SELECT *
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

---

### **3. Aggregations - GROUP BY**

```sql
-- Revenue by category
SELECT 
    c.name,
    COUNT(p.id) as product_count,
    SUM(p.price * p.stock) as inventory_value,
    AVG(p.price) as avg_price,
    MIN(p.price) as cheapest,
    MAX(p.price) as most_expensive
FROM categories c
JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
HAVING SUM(p.price * p.stock) > 100000  -- Only high-value categories
ORDER BY inventory_value DESC;
```

---

### **4. Subqueries**

```sql
-- Find products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- IN subquery
SELECT full_name
FROM users
WHERE id IN (
    SELECT DISTINCT user_id 
    FROM orders 
    WHERE total_amount > 50000
);

-- EXISTS (faster for large datasets)
SELECT full_name
FROM users u
WHERE EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.user_id = u.id AND o.total_amount > 50000
);
```

---

### **5. Common Table Expressions (CTEs)**

```sql
-- Readable, reusable subqueries
WITH high_value_customers AS (
    SELECT user_id, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY user_id
    HAVING SUM(total_amount) > 50000
)
SELECT u.full_name, hvc.total_spent
FROM users u
JOIN high_value_customers hvc ON u.id = hvc.user_id
ORDER BY hvc.total_spent DESC;
```

---

### **6. Window Functions (Advanced)**

```sql
-- Rank products by price within each category
SELECT 
    name,
    category_id,
    price,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank,
    AVG(price) OVER (PARTITION BY category_id) as category_avg_price
FROM products;

-- Running total of orders
SELECT 
    created_at,
    total_amount,
    SUM(total_amount) OVER (ORDER BY created_at) as running_total
FROM orders;
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Complex Analytics Queries** (30 mins)

```python
# analytics_queries.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

print("=== E-COMMERCE ANALYTICS DASHBOARD ===\n")

# 1. Monthly revenue trend
cur.execute("""
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as order_count,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value
    FROM orders
    WHERE status != 'cancelled'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC;
""")

print("1. MONTHLY REVENUE TREND:")
for row in cur.fetchall():
    print(f"   {row[0].strftime('%Y-%m'):10} | Orders: {row[1]:4} | Revenue: ₹{row[2]:>12,.2f} | AOV: ₹{row[3]:>8,.2f}")

# 2. Top 10 best-selling products
cur.execute("""
    SELECT 
        p.name,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue,
        COUNT(DISTINCT oi.order_id) as order_count
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled'
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
    LIMIT 10;
""")

print("\n2. TOP 10 BEST-SELLING PRODUCTS:")
for idx, row in enumerate(cur.fetchall(), 1):
    print(f"   {idx:2}. {row[0]:30} | Sold: {row[1]:4} units | Revenue: ₹{row[2]:>12,.2f}")

# 3. Customer Lifetime Value (CLV)
cur.execute("""
    SELECT 
        u.full_name,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value,
        MAX(o.created_at) as last_order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
    GROUP BY u.id, u.full_name, u.email
    HAVING COUNT(o.id) > 0
    ORDER BY lifetime_value DESC NULLS LAST
    LIMIT 10;
""")

print("\n3. TOP 10 CUSTOMERS (Lifetime Value):")
for row in cur.fetchall():
    print(f"   {row[0]:20} | Orders: {row[2]:3} | CLV: ₹{row[3]:>10,.2f} | Last: {row[5].strftime('%Y-%m-%d')}")

# 4. Product category performance
cur.execute("""
    SELECT 
        c.name as category,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT oi.order_id) as orders_with_category,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue,
        ROUND(AVG(p.rating), 2) as avg_rating
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
    GROUP BY c.id, c.name
    ORDER BY revenue DESC NULLS LAST;
""")

print("\n4. CATEGORY PERFORMANCE:")
for row in cur.fetchall():
    revenue = row[4] if row[4] else 0
    rating = row[5] if row[5] else 0
    print(f"   {row[0]:20} | Products: {row[1]:3} | Orders: {row[2]:4} | Revenue: ₹{revenue:>12,.2f} | ⭐{rating}")

# 5. Order status distribution
cur.execute("""
    SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM orders
    GROUP BY status
    ORDER BY count DESC;
""")

print("\n5. ORDER STATUS DISTRIBUTION:")
for row in cur.fetchall():
    print(f"   {row[0]:15} | {row[1]:4} orders ({row[2]:5.2f}%)")

# 6. Average order processing time (if we have status timestamps)
cur.execute("""
    SELECT 
        AVG(updated_at - created_at) as avg_processing_time,
        MIN(updated_at - created_at) as fastest_processing,
        MAX(updated_at - created_at) as slowest_processing
    FROM orders
    WHERE status = 'delivered' AND updated_at > created_at;
""")

print("\n6. ORDER PROCESSING TIME:")
row = cur.fetchone()
if row[0]:
    print(f"   Average: {row[0]}")
    print(f"   Fastest: {row[1]}")
    print(f"   Slowest: {row[2]}")

cur.close()
conn.close()
```

---

### **Task 2: Query Optimization** (25 mins)

```python
# query_optimization.py
import psycopg2
import time

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

print("=== QUERY OPTIMIZATION DEMO ===\n")

# First, create more test data
print("Creating 10,000 test products...")
cur.execute("""
    INSERT INTO products (name, description, price, stock, category_id)
    SELECT 
        'Product ' || generate_series,
        'Description for product ' || generate_series,
        (random() * 50000)::numeric(10,2),
        (random() * 1000)::integer,
        (SELECT id FROM categories ORDER BY random() LIMIT 1)
    FROM generate_series(1, 10000);
""")
conn.commit()
print("✓ Test data created\n")

# SLOW QUERY (without index)
print("1. SLOW QUERY (Full table scan):")
start = time.time()
cur.execute("""
    SELECT * FROM products WHERE price BETWEEN 10000 AND 20000;
""")
results = cur.fetchall()
slow_time = time.time() - start
print(f"   Found {len(results)} products in {slow_time:.4f} seconds")

# Explain query plan
cur.execute("""
    EXPLAIN ANALYZE
    SELECT * FROM products WHERE price BETWEEN 10000 AND 20000;
""")
print("\n   Query Plan:")
for row in cur.fetchall():
    print(f"   {row[0]}")

# CREATE INDEX
print("\n2. Creating index on price column...")
cur.execute("CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price);")
conn.commit()
print("   ✓ Index created")

# FAST QUERY (with index)
print("\n3. FAST QUERY (Using index):")
start = time.time()
cur.execute("""
    SELECT * FROM products WHERE price BETWEEN 10000 AND 20000;
""")
results = cur.fetchall()
fast_time = time.time() - start
print(f"   Found {len(results)} products in {fast_time:.4f} seconds")

print(f"\n   ⚡ Speedup: {slow_time/fast_time:.2f}x faster with index!")

# Show indexes
cur.execute("""
    SELECT 
        tablename, 
        indexname, 
        indexdef
    FROM pg_indexes
    WHERE tablename = 'products';
""")

print("\n4. ALL INDEXES ON PRODUCTS TABLE:")
for row in cur.fetchall():
    print(f"   • {row[1]}")

cur.close()
conn.close()
```

---

### **Task 3: Window Functions Practice** (20 mins)

```python
# window_functions.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

print("=== WINDOW FUNCTIONS EXAMPLES ===\n")

# 1. Rank products by price within category
cur.execute("""
    SELECT 
        c.name as category,
        p.name as product,
        p.price,
        RANK() OVER (PARTITION BY c.name ORDER BY p.price DESC) as price_rank,
        ROUND(AVG(p.price) OVER (PARTITION BY c.name), 2) as category_avg
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id < 20  -- Just first few products
    ORDER BY c.name, price_rank;
""")

print("1. PRODUCT RANKING BY PRICE (Within Category):")
for row in cur.fetchall():
    diff = row[2] - row[4]
    print(f"   {row[0]:15} | {row[1]:30} | ₹{row[2]:>10,.2f} | Rank: {row[3]} | vs Avg: {'+' if diff > 0 else ''}₹{diff:>8,.2f}")

# 2. Running total of revenue
cur.execute("""
    SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as daily_revenue,
        SUM(SUM(total_amount)) OVER (ORDER BY DATE(created_at)) as cumulative_revenue
    FROM orders
    WHERE status != 'cancelled'
    GROUP BY DATE(created_at)
    ORDER BY date;
""")

print("\n2. DAILY REVENUE WITH RUNNING TOTAL:")
for row in cur.fetchall():
    print(f"   {row[0]} | Daily: ₹{row[1]:>10,.2f} | Cumulative: ₹{row[2]:>12,.2f}")

# 3. Moving average
cur.execute("""
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        AVG(COUNT(*)) OVER (
            ORDER BY DATE(created_at) 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as moving_avg_3day
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 10;
""")

print("\n3. ORDERS WITH 3-DAY MOVING AVERAGE:")
for row in cur.fetchall():
    print(f"   {row[0]} | Orders: {row[1]:3} | 3-day avg: {row[2]:.2f}")

cur.close()
conn.close()
```

---

### **Task 4: Real-World Business Queries** (25 mins)

```python
# business_queries.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flipkart_db",
    user="postgres",
    password="your_password"
)
cur = conn.cursor()

print("=== BUSINESS INTELLIGENCE QUERIES ===\n")

# 1. Customer segmentation (RFM analysis simplified)
cur.execute("""
    WITH customer_metrics AS (
        SELECT 
            u.id,
            u.full_name,
            COUNT(o.id) as order_count,
            SUM(o.total_amount) as total_spent,
            MAX(o.created_at) as last_order_date,
            EXTRACT(DAY FROM NOW() - MAX(o.created_at)) as days_since_last_order
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
        GROUP BY u.id, u.full_name
    )
    SELECT 
        full_name,
        order_count,
        total_spent,
        days_since_last_order,
        CASE 
            WHEN order_count >= 5 AND total_spent >= 50000 THEN 'VIP'
            WHEN order_count >= 3 OR total_spent >= 20000 THEN 'Loyal'
            WHEN order_count >= 1 THEN 'Regular'
            ELSE 'New'
        END as customer_segment
    FROM customer_metrics
    WHERE order_count > 0
    ORDER BY total_spent DESC;
""")

print("1. CUSTOMER SEGMENTATION:")
for row in cur.fetchall():
    print(f"   {row[0]:20} | {row[4]:8} | Orders: {row[1]:2} | Spent: ₹{row[2]:>10,.2f} | Last: {row[3]:.0f} days ago")

# 2. Product recommendation (customers who bought X also bought Y)
cur.execute("""
    WITH product_pairs AS (
        SELECT 
            oi1.product_id as product_a,
            oi2.product_id as product_b,
            COUNT(DISTINCT oi1.order_id) as co_purchase_count
        FROM order_items oi1
        JOIN order_items oi2 ON oi1.order_id = oi2.order_id 
            AND oi1.product_id < oi2.product_id
        GROUP BY oi1.product_id, oi2.product_id
        HAVING COUNT(DISTINCT oi1.order_id) > 0
    )
    SELECT 
        p1.name as product_1,
        p2.name as product_2,
        pp.co_purchase_count
    FROM product_pairs pp
    JOIN products p1 ON pp.product_a = p1.id
    JOIN products p2 ON pp.product_b = p2.id
    ORDER BY pp.co_purchase_count DESC
    LIMIT 10;
""")

print("\n2. FREQUENTLY BOUGHT TOGETHER:")
for row in cur.fetchall():
    print(f"   {row[0]:30} + {row[1]:30} | Bought together {row[2]} times")

# 3. Inventory alert (low stock + high demand)
cur.execute("""
    SELECT 
        p.name,
        p.stock,
        p.price,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        CASE 
            WHEN p.stock < 10 AND COALESCE(SUM(oi.quantity), 0) > 20 THEN 'URGENT'
            WHEN p.stock < 20 AND COALESCE(SUM(oi.quantity), 0) > 10 THEN 'LOW'
            ELSE 'OK'
        END as stock_status
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.stock, p.price
    HAVING p.stock < 50
    ORDER BY 
        CASE 
            WHEN p.stock < 10 AND COALESCE(SUM(oi.quantity), 0) > 20 THEN 1
            WHEN p.stock < 20 AND COALESCE(SUM(oi.quantity), 0) > 10 THEN 2
            ELSE 3
        END,
        p.stock ASC;
""")

print("\n3. INVENTORY ALERTS:")
for row in cur.fetchall():
    status_icon = "🔴" if row[4] == "URGENT" else "🟡" if row[4] == "LOW" else "🟢"
    print(f"   {status_icon} {row[0]:30} | Stock: {row[1]:3} | Sold: {row[3]:4} | ₹{row[2]:>10,.2f}")

# 4. Churn prediction (customers who haven't ordered in 90+ days)
cur.execute("""
    SELECT 
        u.full_name,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as lifetime_value,
        MAX(o.created_at) as last_order,
        EXTRACT(DAY FROM NOW() - MAX(o.created_at)) as days_inactive
    FROM users u
    JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.full_name, u.email
    HAVING EXTRACT(DAY FROM NOW() - MAX(o.created_at)) > 90
    ORDER BY lifetime_value DESC;
""")

print("\n4. AT-RISK CUSTOMERS (90+ days inactive):")
for row in cur.fetchall():
    print(f"   {row[0]:20} | {row[2]:2} orders | LTV: ₹{row[3]:>10,.2f} | Inactive: {row[5]:.0f} days")

cur.close()
conn.close()
```

---

## ✅ Verification Checklist

Before Day 18:

- [ ] Master INNER JOIN, LEFT JOIN, understand when to use each
- [ ] Write GROUP BY queries with HAVING
- [ ] Use subqueries and CTEs
- [ ] Understand window functions (RANK, SUM OVER)
- [ ] Can optimize queries with indexes
- [ ] Explain EXPLAIN ANALYZE output
- [ ] Write business analytics queries

**Self-Test:** Write a query to find top 10 customers who bought products in at least 3 different categories

---

## 📖 Resources

- **SQL Practice:** [sqlbolt.com](https://sqlbolt.com/), [leetcode.com/problemset/database](https://leetcode.com/problemset/database/)
- **PostgreSQL Performance:** Official tuning guide
- **Window Functions:** [postgresql.org/docs/current/tutorial-window.html](https://www.postgresql.org/docs/current/tutorial-window.html)

---

## 🚀 Wrap Up

**Congratulations on completing Day 17!** 🎉

Tomorrow: **Day 18 - NoSQL Databases** (MongoDB, Redis, when to use document stores!)

[← Day 16: Database Systems](./Day%2016%20-%20Database%20Systems%20(DBMS).md) | [Day 18: NoSQL →](./Day%2018%20-%20NoSQL%20Databases.md)
