# 📅 Day 6: Algorithmic Thinking - Problem Solving Like a Programmer

**Module:** Programming & Data Structures (Days 6-10)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - foundational thinking skills)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- How to break down complex problems into steps (algorithmic thinking)
- Time and space complexity (Big O notation)
- How to write pseudocode and flowcharts
- Why some algorithms are faster than others
- How to trace code execution manually (dry run)

**Real-world relevance:** Core skill for coding interviews, optimizing code performance, and building efficient solutions (critical for ALL programming roles).

---

## 📚 Theory (45-60 minutes)

### **1. What is an Algorithm?**

**Algorithm** = Step-by-step instructions to solve a problem

**Real-Life Example - Making Chai (Tea):**
```
1. Boil water
2. Add tea leaves
3. Add milk
4. Add sugar
5. Boil for 2 minutes
6. Strain and serve
```

**Indian Tech Example - UPI Payment:**
```
Algorithm: Process_UPI_Payment(amount, upi_id)
1. Verify user is logged in
2. Check if balance >= amount
3. If yes:
   a. Deduct amount from sender
   b. Add amount to receiver
   c. Create transaction record
   d. Send confirmation
4. If no:
   a. Show "Insufficient balance" error
5. End
```

---

### **2. Control Structures**

Every algorithm uses these 3 building blocks:

#### **A. Sequential (One after another)**
```python
# Making Maggi
boil_water()
add_noodles()
add_masala()
cook_for_2_minutes()
serve()
```

#### **B. Selection (Decision making)**
```python
# Swiggy delivery fee
if distance < 2:
    delivery_fee = 0
elif distance < 5:
    delivery_fee = 20
else:
    delivery_fee = 40
```

#### **C. Iteration (Repetition)**
```python
# Process all pending orders
for order in pending_orders:
    process_order(order)
    send_confirmation()
```

---

### **3. Big O Notation - Algorithm Efficiency**

**Big O** = How runtime grows as input size increases

```
Input Size (n)     O(1)   O(log n)  O(n)   O(n log n)  O(n²)   O(2ⁿ)
─────────────────────────────────────────────────────────────────────
10                  1       3        10      33         100     1024
100                 1       7        100     664        10K     ∞
1000                1       10       1000    9966       1M      ∞
10000               1       13       10K     132K       100M    ∞
```

**From Best to Worst:**
- **O(1)** - Constant - Always same time
- **O(log n)** - Logarithmic - Very efficient
- **O(n)** - Linear - Proportional to input
- **O(n log n)** - Efficient sorting
- **O(n²)** - Quadratic - Slow for large inputs
- **O(2ⁿ)** - Exponential - VERY slow

---

#### **Real Examples:**

**O(1) - Constant Time:**
```python
# Get first item from list (instant, no matter list size)
first_item = products[0]  # O(1)

# Dictionary lookup
user = users_dict['user_id_123']  # O(1)
```

**Indian Example:** Checking UPI balance - always takes same time regardless of transaction history

---

**O(n) - Linear Time:**
```python
# Find a product by name in list
def find_product(products, name):
    for product in products:  # Checks each item
        if product.name == name:
            return product
    return None
# If 100 products → 100 checks (worst case)
# If 1000 products → 1000 checks
```

**Indian Example:** Searching for a name in Aadhaar database (without index) - time proportional to database size

---

**O(n²) - Quadratic Time:**
```python
# Find duplicate products (bad algorithm)
def find_duplicates(products):
    duplicates = []
    for i in range(len(products)):           # n times
        for j in range(i+1, len(products)):  # n times
            if products[i] == products[j]:
                duplicates.append(products[i])
    return duplicates
# 100 products → 10,000 comparisons
# 1000 products → 1,000,000 comparisons!
```

**Indian Example:** Checking every passenger against every other passenger for duplicate bookings in IRCTC - VERY slow!

---

**O(log n) - Logarithmic (Very Efficient):**
```python
# Binary search in sorted list
def binary_search(sorted_list, target):
    left, right = 0, len(sorted_list) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# 1000 items → Only 10 checks!
# 1,000,000 items → Only 20 checks!
```

**Indian Example:** Finding a pin code in sorted database - eliminates half the data each step

---

### **4. Pseudocode - Algorithm Blueprint**

Pseudocode = English-like description of algorithm (not actual code)

**Example: Calculate Restaurant Bill with GST**

```
ALGORITHM: Calculate_Restaurant_Bill

INPUT: 
  - items_ordered (list of menu items)
  - gst_rate (percentage, e.g., 5% for non-AC, 18% for AC)

OUTPUT:
  - total_bill (final amount to pay)

STEPS:
1. SET subtotal = 0
2. FOR each item IN items_ordered:
     subtotal = subtotal + item.price
3. SET gst_amount = subtotal * (gst_rate / 100)
4. SET total_bill = subtotal + gst_amount
5. DISPLAY "Subtotal: ₹" + subtotal
6. DISPLAY "GST (" + gst_rate + "%): ₹" + gst_amount
7. DISPLAY "Total: ₹" + total_bill
8. RETURN total_bill

END
```

---

### **5. Dry Run - Manual Code Tracing**

**Example: Find maximum in list**

```python
numbers = [45, 12, 89, 23, 67]
max_so_far = numbers[0]

for num in numbers:
    if num > max_so_far:
        max_so_far = num

print(max_so_far)
```

**Dry Run Table:**

| Step | num | max_so_far | Comparison | Action |
|------|-----|------------|------------|--------|
| Init | -   | 45         | -          | Set to first element |
| 1    | 45  | 45         | 45 > 45? No | No change |
| 2    | 12  | 45         | 12 > 45? No | No change |
| 3    | 89  | 45         | 89 > 45? Yes | max = 89 |
| 4    | 23  | 89         | 23 > 89? No | No change |
| 5    | 67  | 89         | 67 > 89? No | No change |
| End  | -   | 89         | -          | **Output: 89** |

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Write Pseudocode for Real Problems** (20 mins)

**Problem 1: UPI PIN Verification with 3 Attempts**

```
ALGORITHM: Verify_UPI_PIN

INPUT: correct_pin (stored securely)
OUTPUT: success (true/false)

STEPS:
1. SET attempts_left = 3
2. SET success = false

3. WHILE attempts_left > 0:
     a. DISPLAY "Enter UPI PIN: "
     b. INPUT user_input
     
     c. IF user_input == correct_pin THEN:
          i. DISPLAY "✓ PIN Verified"
          ii. SET success = true
          iii. BREAK loop
     
     d. ELSE:
          i. SET attempts_left = attempts_left - 1
          ii. IF attempts_left > 0 THEN:
                DISPLAY "❌ Wrong PIN. " + attempts_left + " attempts left"
          iii. ELSE:
                DISPLAY "❌ Account locked. Contact bank."
     
4. RETURN success

END
```

**Now YOU write pseudocode for:**

**Problem 2: Cab Fare Calculator (Ola/Uber)**
```
Rules:
- Base fare: ₹50
- Per km: ₹10
- Waiting charge: ₹2 per minute
- Night charge (11 PM - 5 AM): 1.5x total
- GST: 5% on final amount
```

**Save your solution in `day06_pseudocode.txt`**

---

### **Task 2: Implement & Analyze Time Complexity** (30 mins)

**Write `complexity_comparison.py`:**

```python
import time
import random

# O(n) - Linear Search
def linear_search(arr, target):
    """Search for target in unsorted list"""
    for i, item in enumerate(arr):
        if item == target:
            return i
    return -1

# O(log n) - Binary Search (requires sorted list)
def binary_search(arr, target):
    """Search for target in sorted list"""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# O(n²) - Bubble Sort (inefficient)
def bubble_sort(arr):
    """Sort array using bubble sort"""
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# O(n log n) - Built-in sort (efficient)
def efficient_sort(arr):
    """Python's built-in Timsort"""
    return sorted(arr)


# Performance Testing
print("=== Algorithm Complexity Comparison ===\n")

# Test 1: Search Comparison
sizes = [1000, 10000, 100000]

print("1. SEARCH: Linear O(n) vs Binary O(log n)")
print("-" * 50)

for size in sizes:
    # Create sorted array
    data = list(range(size))
    target = random.randint(0, size-1)
    
    # Linear Search
    start = time.time()
    linear_search(data, target)
    linear_time = (time.time() - start) * 1000  # ms
    
    # Binary Search
    start = time.time()
    binary_search(data, target)
    binary_time = (time.time() - start) * 1000  # ms
    
    speedup = linear_time / binary_time if binary_time > 0 else 0
    
    print(f"Size: {size:,}")
    print(f"  Linear: {linear_time:.4f} ms")
    print(f"  Binary: {binary_time:.4f} ms")
    print(f"  Binary is {speedup:.1f}x faster!\n")

# Test 2: Sort Comparison
print("\n2. SORT: Bubble O(n²) vs Timsort O(n log n)")
print("-" * 50)

sizes = [100, 500, 1000]

for size in sizes:
    data = [random.randint(1, 1000) for _ in range(size)]
    
    # Bubble Sort
    start = time.time()
    bubble_sort(data.copy())
    bubble_time = (time.time() - start) * 1000
    
    # Efficient Sort
    start = time.time()
    efficient_sort(data.copy())
    efficient_time = (time.time() - start) * 1000
    
    speedup = bubble_time / efficient_time if efficient_time > 0 else 0
    
    print(f"Size: {size}")
    print(f"  Bubble Sort: {bubble_time:.2f} ms")
    print(f"  Timsort:     {efficient_time:.2f} ms")
    print(f"  Timsort is {speedup:.1f}x faster!\n")

print("\n💡 Key Takeaway:")
print("For large data (like Flipkart's product catalog),")
print("choosing the right algorithm = 100x-1000x speedup!")
```

**Run and observe** how algorithm choice impacts performance!

---

### **Task 3: Dry Run Practice** (20 mins)

**Code to Dry Run:**

```python
# Calculate discount on Flipkart
def calculate_discount(cart_value, is_prime_member):
    """
    Discount Rules:
    - Cart < ₹500: No discount
    - Cart ≥ ₹500 & < ₹1000: 10% off
    - Cart ≥ ₹1000: 15% off
    - Prime members: Additional 5% off
    """
    discount = 0
    
    if cart_value >= 500:
        if cart_value >= 1000:
            discount = 0.15
        else:
            discount = 0.10
    
    if is_prime_member:
        discount += 0.05
    
    discount_amount = cart_value * discount
    final_price = cart_value - discount_amount
    
    return final_price, discount_amount

# Test cases
print(calculate_discount(450, False))
print(calculate_discount(750, True))
print(calculate_discount(1200, True))
```

**Create a dry run table in `day06_dryrun.md`:**

```markdown
# Dry Run: calculate_discount()

## Test Case 1: cart_value=450, is_prime_member=False

| Line | Variable | Value | Action |
|------|----------|-------|--------|
| 1    | cart_value | 450 | Input |
| 2    | is_prime_member | False | Input |
| 3    | discount | 0 | Initialize |
| 5    | - | - | 450 >= 500? False, skip |
| 11   | - | - | is_prime_member? False, skip |
| 14   | discount_amount | 0 | 450 * 0 |
| 15   | final_price | 450 | 450 - 0 |
| 17   | return | (450, 0) | **Output** |

## Test Case 2: cart_value=750, is_prime_member=True
[Complete this yourself]

## Test Case 3: cart_value=1200, is_prime_member=True
[Complete this yourself]
```

---

### **Task 4: Flowchart Creation** (15 mins)

**Draw a flowchart for:** "Swiggy Delivery Fee Calculator"

Rules:
- Distance < 2km: Free delivery
- 2km ≤ Distance < 5km: ₹20
- Distance ≥ 5km: ₹40
- If it's raining: Add ₹10 to any fee

**Use ASCII art in `day06_flowchart.md`:**

```
START
  ↓
[Input: distance, is_raining]
  ↓
<distance < 2?> ─Yes─> [fee = 0]
  ↓No                      ↓
<distance < 5?> ─Yes─> [fee = 20]
  ↓No                      ↓
[fee = 40] ←──────────────┘
  ↓
<is_raining?> ─Yes─> [fee = fee + 10]
  ↓No                      ↓
  └──────────────────────>┘
  ↓
[Display fee]
  ↓
END
```

**Bonus:** Use online tools like draw.io or Lucidchart

---

### **Task 5: Optimize an Algorithm** (25 mins)

**Problem:** Find if a number exists in a list

**Bad Approach (O(n²)):**
```python
# Check if any order ID is duplicate
order_ids = [101, 102, 103, 104, 105, 103]  # 103 is duplicate

def has_duplicate_bad(ids):
    """O(n²) - Very slow for large lists"""
    for i in range(len(ids)):
        for j in range(i+1, len(ids)):
            if ids[i] == ids[j]:
                return True
    return False

# For 10,000 orders → 100 million comparisons!
```

**Good Approach (O(n)):**
```python
def has_duplicate_good(ids):
    """O(n) - Much faster!"""
    seen = set()
    for id in ids:
        if id in seen:
            return True
        seen.add(id)
    return False

# For 10,000 orders → 10,000 checks only!
```

**YOUR TASK:** Write both versions and benchmark:

```python
import time
import random

# Generate test data
large_list = [random.randint(1, 50000) for _ in range(10000)]

# Test bad version (might take a while!)
start = time.time()
has_duplicate_bad(large_list)
bad_time = time.time() - start

# Test good version
start = time.time()
has_dup duplicate_good(large_list)
good_time = time.time() - start

print(f"Bad (O(n²)): {bad_time:.4f} seconds")
print(f"Good (O(n)): {good_time:.4f} seconds")
print(f"Improvement: {bad_time/good_time:.0f}x faster!")
```

**Document your findings** in `day06_optimization.md`

---

## ✅ Verification Checklist

Before moving to Day 7, ensure you can answer:

- [ ] What is an algorithm?
- [ ] Explain the 3 control structures with examples
- [ ] What does Big O notation measure?
- [ ] Which is faster: O(n) or O(log n)? Why?
- [ ] Why is O(n²) bad for large inputs?
- [ ] How do you write pseudocode?
- [ ] What is a dry run and why is it useful?
- [ ] Give a real-world example where algorithm choice matters

**Self-Test:** Explain to a friend why Google Search is so fast (hint: it doesn't use O(n) search!)

---

## 📖 Resources

### **Video Tutorials:**
- **Abdul Bari:** Algorithms playlist (YouTube)
- **mycodeschool:** Time complexity explained
- **freeCodeCamp:** Algorithms for beginners

### **Interactive:**
- **VisuAlgo:** Visualize algorithms
- **LeetCode:** Practice easy problems
- **HackerRank:** Algorithm basics track

### **Reading:**
- **Big-O Cheat Sheet:** [bigocheatsheet.com](https://www.bigocheatsheet.com/)
- **GeeksforGeeks:** Time & Space Complexity

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **Any Programming Role** | Core skill - optimizing code is CRITICAL |
| **Backend Developer** | Database query optimization, API performance |
| **Data Engineer** | Processing millions of records efficiently |
| **ML Engineer** | Training models faster with better algorithms |
| **Competitive Programmer** | Solving problems within time limits |
| **Interview Success** | 90% of coding interviews test algorithm skills |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 6!** 🎉

### **Before Day 7:**
1. Push to GitHub
   ```bash
   git add .
   git commit -m "Day 6: Algorithmic Thinking - Big O, pseudocode, optimization"
   git push
   ```

2. Update Progress Tracker

3. Share:
   ```
   Day 6/30: Algorithmic Thinking ✅
   
   Learned Big O notation - O(n²) vs O(log n) makes HUGE difference!
   
   Optimized a search algorithm - 1000x faster! 🚀
   
   #30DaysOfCode #Algorithms
   ```

4. **Tomorrow:** Day 7 - Programming Paradigms (Procedural vs OOP vs Functional)

---

**Fun Fact:** Google's PageRank algorithm (what made Google successful) is O(n) per iteration - that's why it could index billions of pages! 🌐

[← Day 5: HTTP](../Module%201%20-%20Systems%20&%20Architecture%20(Days%201-5)/Day%2005%20-%20The%20Internet%20&%20HTTP.md) | [Day 7: Programming Paradigms →](./Day%2007%20-%20Programming%20Paradigms.md)
