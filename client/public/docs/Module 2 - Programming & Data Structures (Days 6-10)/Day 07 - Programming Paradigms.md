# 📅 Day 7: Programming Paradigms - Different Ways to Think

**Module:** Programming & Data Structures (Days 6-10)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - conceptual understanding)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- Different programming paradigms (Procedural, OOP, Functional)
- When to use each paradigm
- Compiled vs Interpreted languages
- Why Python is different from C/Java
- How modern languages combine multiple paradigms

**Real-world relevance:** Understanding paradigms helps you choose the right tool for the job and makes you a better programmer in ANY language.

---

## 📚 Theory (45-60 minutes)

### **1. What is a Programming Paradigm?**

**Paradigm** = A way of thinking about and organizing code

Think of it like cooking styles:
- **Indian cooking:** Uses spices, masalas (one approach)
- **Chinese cooking:** Stir-fry, wok (different tools)
- **Italian cooking:** Pasta, sauces (different focus)

All achieve the goal (food) but with different approaches!

---

### **2. Procedural Programming - Step by Step**

**Idea:** Program is a sequence of procedures/functions

```python
# Procedural approach: Calculate restaurant bill

def get_subtotal(items):
    total = 0
    for item in items:
        total += item['price']
    return total

def calculate_gst(subtotal, rate=0.05):
    return subtotal * rate

def calculate_tip(subtotal, tip_percent=10):
    return subtotal * (tip_percent / 100)

def generate_bill(items):
    subtotal = get_subtotal(items)
    gst = calculate_gst(subtotal)
    tip = calculate_tip(subtotal)
    total = subtotal + gst + tip
    
    print(f"Subtotal: ₹{subtotal}")
    print(f"GST (5%): ₹{gst}")
    print(f"Tip (10%): ₹{tip}")
    print(f"Total: ₹{total}")
    return total

# Usage
menu_items = [
    {'name': 'Butter Chicken', 'price': 350},
    {'name': 'Naan', 'price': 40},
    {'name': 'Lassi', 'price': 60}
]

generate_bill(menu_items)
```

**Characteristics:**
- ✅ Simple, easy to understand
- ✅ Good for small programs
- ⚠️ Data and functions are separate
- ⚠️ Hard to manage in large programs

**Languages:** C, Pascal, early BASIC

---

### **3. Object-Oriented Programming (OOP) - Objects & Classes**

**Idea:** Program is a collection of interacting objects

```python
# OOP approach: Same restaurant bill

class MenuItem:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class Bill:
    def __init__(self, gst_rate=0.05, tip_percent=10):
        self.items = []
        self.gst_rate = gst_rate
        self.tip_percent = tip_percent
    
    def add_item(self, item):
        self.items.append(item)
    
    def get_subtotal(self):
        return sum(item.price for item in self.items)
    
    def get_gst(self):
        return self.get_subtotal() * self.gst_rate
    
    def get_tip(self):
        return self.get_subtotal() * (self.tip_percent / 100)
    
    def get_total(self):
        return self.get_subtotal() + self.get_gst() + self.get_tip()
    
    def print_bill(self):
        print("=== BILL ===")
        for item in self.items:
            print(f"{item.name}: ₹{item.price}")
        print(f"\nSubtotal: ₹{self.get_subtotal()}")
        print(f"GST ({self.gst_rate*100}%): ₹{self.get_gst()}")
        print(f"Tip ({self.tip_percent}%): ₹{self.get_tip()}")
        print(f"Total: ₹{self.get_total()}")

# Usage
bill = Bill()
bill.add_item(MenuItem('Butter Chicken', 350))
bill.add_item(MenuItem('Naan', 40))
bill.add_item(MenuItem('Lassi', 60))
bill.print_bill()
```

**Characteristics:**
- ✅ Data and methods bundled together (encapsulation)
- ✅ Reusable (inheritance)
- ✅ Models real-world entities well
- ✅ Great for large applications

**Languages:** Java, C++, Python, C#

**Real-World:** Most enterprise software (bank systems, e-commerce) uses OOP

---

### **4. Functional Programming - Functions as First-Class Citizens**

**Idea:** Program is a composition of pure functions (no side effects)

```python
# Functional approach: Same restaurant bill

from functools import reduce

# Pure functions (no side effects)
def get_item_price(item):
    return item['price']

def sum_prices(items):
    return reduce(lambda total, item: total + item['price'], items, 0)

def calculate_gst(subtotal, rate=0.05):
    return subtotal * rate

def calculate_tip(subtotal, percent=10):
    return subtotal * (percent / 100)

def calculate_total(subtotal, gst, tip):
    return subtotal + gst + tip

# Composition
def generate_bill_functional(items):
    subtotal = sum_prices(items)
    gst = calculate_gst(subtotal)
    tip = calculate_tip(subtotal)
    total = calculate_total(subtotal, gst, tip)
    
    return {
        'subtotal': subtotal,
        'gst': gst,
        'tip': tip,
        'total': total
    }

# Usage (no state modification)
items = [
    {'name': 'Butter Chicken', 'price': 350},
    {'name': 'Naan', 'price': 40}
]

bill_data = generate_bill_functional(items)
print(bill_data)
```

**Characteristics:**
- ✅ No side effects (functions don't modify state)
- ✅ Easier to test
- ✅ Better for parallel processing
- ⚠️ Can be harder to understand initially

**Languages:** Haskell, Lisp, Scala, JavaScript (functional features)

**Real-World:** React (frontend), data processing pipelines

---

### **5. Comparison Table**

| Feature | Procedural | OOP | Functional |
|---------|-----------|-----|------------|
| **Main unit** | Functions | Objects | Functions |
| **Data** | Separate from functions | Bundled with methods | Immutable |
| **State** | Global/local variables | Object properties | Avoid state |
| **Reuse** | Function calls | Inheritance, polymorphism | Function composition |
| **Best for** | Small scripts | Large applications | Data processing |
| **Example** | C | Java, Python | Haskell, Scala |
| **Indian Use Case** | CLI tools | Banking apps | Data analytics |

---

### **6. Compiled vs Interpreted Languages**

#### **Compiled (C, Java):**
```
Write Code → Compiler → Machine Code → Run
  (once)      (once)    (binary)      (fast!)

Example:
main.c → gcc compiler → main.exe → Runs directly on CPU
```

**Pros:**
- ✅ Very fast execution  
- ✅ Errors caught before running

**Cons:**
- ⚠️ Need to recompile for changes
- ⚠️ Platform-specific (Windows .exe won't run on Linux)

---

#### **Interpreted (Python, JavaScript):**
```
Write Code → Interpreter → Execution
  (edit)     (line by line)  (slower)

Example:
script.py → Python interpreter → Executes directly
```

**Pros:**
- ✅ No compilation step (faster development)
- ✅ Cross-platform (same code runs everywhere)
- ✅ Dynamic typing

**Cons:**
- ⚠️ Slower execution
- ⚠️ Errors only found at runtime

---

#### **Hybrid (Java, C#):**
```
Java Code → Java Compiler → Bytecode → JVM → Runs
                          (platform-independent)

Advantage: Write once, run anywhere (WORA)
```

---

### **7. Multi-Paradigm Languages (Python, JavaScript)**

Modern languages support MULTIPLE paradigms:

```python
# Python can do ALL of these!

# 1. Procedural
def greet(name):
    print(f"Hello, {name}!")

# 2. OOP
class User:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        print(f"Hello, {self.name}!")

# 3. Functional
greet_functional = lambda name: print(f"Hello, {name}!")

# Use whatever fits your problem!
```

**Indian Example - PayTM:**
- **OOP:** User accounts, wallet objects
- **Procedural:** Transaction processing steps
- **Functional:** Data analytics (process millions of transactions)

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Same Problem, 3 Paradigms** (30 mins)

**Problem:** UPI Payment System (Simplified)

**Write `paradigm_comparison.py`:**

```python
# ============ 1. PROCEDURAL APPROACH ============
print("=== PROCEDURAL PARADIGM ===\n")

# Global data
accounts = {
    'user1@paytm': 5000,
    'user2@paytm': 3000
}

def check_balance(upi_id):
    return accounts.get(upi_id, 0)

def transfer_money(sender_upi, receiver_upi, amount):
    sender_balance = check_balance(sender_upi)
    
    if sender_balance >= amount:
        accounts[sender_upi] -= amount
        accounts[receiver_upi] = check_balance(receiver_upi) + amount
        print(f"✓ Sent ₹{amount} from {sender_upi} to {receiver_upi}")
        return True
    else:
        print(f"❌ Insufficient balance!")
        return False

# Test
print(f"Initial balance: {accounts}")
transfer_money('user1@paytm', 'user2@paytm', 1000)
print(f"After transfer: {accounts}\n")


# ============ 2. OOP APPROACH ============
print("=== OBJECT-ORIENTED PARADIGM ===\n")

class UPIAccount:
    def __init__(self, upi_id, balance=0):
        self.upi_id = upi_id
        self.balance = balance
        self.transaction_history = []
    
    def check_balance(self):
        return self.balance
    
    def transfer(self, recipient, amount):
        if self.balance >= amount:
            self.balance -= amount
            recipient.balance += amount
            
            # Record transaction
            self.transaction_history.append(f"Sent ₹{amount} to {recipient.upi_id}")
            recipient.transaction_history.append(f"Received ₹{amount} from {self.upi_id}")
            
            print(f"✓ {self.upi_id} sent ₹{amount} to {recipient.upi_id}")
            return True
        else:
            print(f"❌ Insufficient balance!")
            return False
    
    def show_history(self):
        print(f"\nTransaction History for {self.upi_id}:")
        for txn in self.transaction_history:
            print(f"  - {txn}")

# Test
account1 = UPIAccount('user1@paytm', 5000)
account2 = UPIAccount('user2@paytm', 3000)

print(f" {account1.upi_id}: ₹{account1.balance}")
print(f"{account2.upi_id}: ₹{account2.balance}")

account1.transfer(account2, 1000)

print(f"\nAfter transfer:")
print(f"{account1.upi_id}: ₹{account1.balance}")
print(f"{account2.upi_id}: ₹{account2.balance}")
account1.show_history()


# ============ 3. FUNCTIONAL APPROACH ============
print("\n\n=== FUNCTIONAL PARADIGM ===\n")

# Immutable data structures
def create_account(upi_id, balance):
    return {'upi_id': upi_id, 'balance': balance, 'history': []}

def get_balance(account):
    return account['balance']

def transfer(sender, receiver, amount):
    """Returns NEW account objects (doesn't modify originals)"""
    if get_balance(sender) >= amount:
        new_sender = {
            **sender,
            'balance': sender['balance'] - amount,
            'history': sender['history'] + [f"Sent ₹{amount}"]
        }
        new_receiver = {
            **receiver,
            'balance': receiver['balance'] + amount,
            'history': receiver['history'] + [f"Received ₹{amount}"]
        }
        return new_sender, new_receiver, True
    else:
        return sender, receiver, False

# Test (original objects never modified!)
acc1 = create_account('user1@paytm', 5000)
acc2 = create_account('user2@paytm', 3000)

print(f"Before: {acc1['upi_id']} = ₹{acc1['balance']}, {acc2['upi_id']} = ₹{acc2['balance']}")

new_acc1, new_acc2, success = transfer(acc1, acc2, 1000)

if success:
    print(f"After: {new_acc1['upi_id']} = ₹{new_acc1['balance']}, {new_acc2['upi_id']} = ₹{new_acc2['balance']}")
    print(f"Original unchanged: {acc1['upi_id']} = ₹{acc1['balance']}")  # Still 5000!
```

**Observe differences:** How each paradigm approaches the same problem!

---

### **Task 2: Compiled vs Interpreted Demo** (25 mins)

**Step 1: Write C program (`hello.c`):**
```c
#include <stdio.h>
#include <time.h>

int main() {
    clock_t start = clock();
    
    long long sum = 0;
    for (long long i = 0; i < 1000000000; i++) {
        sum += i;
    }
    
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    
    printf("Sum: %lld\n", sum);
    printf("Time: %.4f seconds\n", time_taken);
    
    return 0;
}
```

**Compile and run:**
```bash
gcc hello.c -o hello
./hello  # (or hello.exe on Windows)
```

**Step 2: Write Python equivalent (`hello.py`):**
```python
import time

start = time.time()

total = 0
for i in range(1000000000):
    total += i

end = time.time()

print(f"Sum: {total}")
print(f"Time: {end-start:.4f} seconds")
```

**Run:**
```bash
python hello.py
```

**Document results in `day07_compiled_vs_interpreted.md`:**
```markdown
# Compiled vs Interpreted Performance

## Results:
- C (compiled): X.XX seconds
- Python (interpreted): Y.YY seconds

## Speed Difference:
Python is ~XX times slower than C for this task

## Why?
- C compiles directly to machine code
- Python interpreter adds overhead

## When to use each:
- C: Performance-critical (games, OS, embedded)
- Python: Rapid development, data analysis, web apps
```

---

### **Task 3: Pure Functions vs Impure Functions** (20 mins)

**Write `pure_vs_impure.py`:**

```python
# IMPURE FUNCTION (has side effects)
total = 0  # Global state

def add_impure(x):
    global total
    total += x  # Modifies global state!
    return total

print("Impure function:")
print(add_impure(5))   # 5
print(add_impure(10))  # 15
print(add_impure(5))   # 20 (same input, different output!)


# PURE FUNCTION (no side effects)
def add_pure(a, b):
    return a + b  # Only depends on inputs, no global state

print("\nPure function:")
print(add_pure(5, 10))   # 15
print(add_pure(5, 10))   # 15 (same input, always same output!)


# Real-world example: Discount calculation
cart_value = 1000

# IMPURE: modifies external state
def apply_discount_impure(discount_percent):
    global cart_value
    cart_value -= cart_value * (discount_percent / 100)
    return cart_value

# PURE: returns new value without modifying input
def apply_discount_pure(value, discount_percent):
    return value - (value * (discount_percent / 100))

print("\nDiscount example:")
print(f"Original cart value: ₹{cart_value}")

# Impure
apply_discount_impure(10)
print(f"After impure discount: ₹{cart_value}")  # cart_value changed!

# Pure
final_value = apply_discount_pure(1000, 10)
print(f"After pure discount: ₹{final_value}")
print(f"Original still: ₹1000")  # Original value unchanged
```

**Question:** Why are pure functions preferred in large applications?  
**Answer in `day07_pure_functions.md`**

---

### **Task 4: Inheritance vs Composition** (20 mins)

**Problem:** Restaurant menu system with different item types

**Write `inheritance_vs_composition.py`:**

```python
# INHERITANCE APPROACH
class MenuItem:
    def __init__(self, name, price):
        self.name = name
        self.price = price
    
    def get_price(self):
        return self.price

class VegItem(MenuItem):
    def __init__(self, name, price):
        super().__init__(name, price)
        self.is_veg = True
    
    def get_description(self):
        return f"🥬 {self.name} - ₹{self.price} (Veg)"

class NonVegItem(MenuItem):
    def __init__(self, name, price):
        super().__init__(name, price)
        self.is_veg = False
    
    def get_description(self):
        return f"🍗 {self.name} - ₹{self.price} (Non-Veg)"

# Test
paneer = VegItem("Paneer Tikka", 250)
chicken = NonVegItem("Butter Chicken", 350)

print("=== INHERITANCE ===")
print(paneer.get_description())
print(chicken.get_description())


# COMPOSITION APPROACH (More flexible!)
class MenuItemComposition:
    def __init__(self, name, price, item_type):
        self.name = name
        self.price = price
        self.type = item_type  # Composition: has-a relationship
    
    def get_description(self):
        icon = "🥬" if self.type.is_veg else "🍗"
        return f"{icon} {self.name} - ₹{self.price} ({self.type.label})"

class ItemType:
    def __init__(self, label, is_veg):
        self.label = label
        self.is_veg = is_veg

# Define types
veg_type = ItemType("Veg", True)
non_veg_type = ItemType("Non-Veg", False)

# Create items
paneer2 = MenuItemComposition("Paneer Tikka", 250, veg_type)
chicken2 = MenuItemComposition("Butter Chicken", 350, non_veg_type)

print("\n=== COMPOSITION ===")
print(paneer2.get_description())
print(chicken2.get_description())

# Composition is more flexible - easy to add new types!
vegan_type = ItemType("Vegan", True)
salad = MenuItemComposition("Green Salad", 150, vegan_type)
print(salad.get_description())
```

---

### **Task 5: First-Class Functions** (15 mins)

**Python treats functions as values (functional programming feature):**

```python
# Functions can be assigned to variables
def discount_10(price):
    return price * 0.9

def discount_20(price):
    return price * 0.8

# Store in variable
apply_discount = discount_10
print(apply_discount(1000))  # 900


# Functions can be passed as arguments
def calculate_total(items, discount_func):
    total = sum(items)
    return discount_func(total)

items = [500, 300, 200]
print(calculate_total(items, discount_10))  # 900
print(calculate_total(items, discount_20))  # 800


# Functions can return functions
def create_discount_function(percent):
    def discount(price):
        return price * (1 - percent/100)
    return discount

discount_15 = create_discount_function(15)
print(discount_15(1000))  # 850


# Indian e-commerce example: Dynamic pricing
def get_pricing_strategy(user_type):
    if user_type == "prime":
        return lambda price: price * 0.85  # 15% off
    elif user_type == "new":
        return lambda price: price * 0.9   # 10% off
    else:
        return lambda price: price         # No discount

prime_pricing = get_pricing_strategy("prime")
regular_pricing = get_pricing_strategy("regular")

product_price = 1000
print(f"Prime user pays: ₹{prime_pricing(product_price)}")
print(f"Regular user pays: ₹{regular_pricing(product_price)}")
```

---

## ✅ Verification Checklist

Before moving to Day 8, ensure you can answer:

- [ ] What are the 3 main programming paradigms?
- [ ] Explain the difference between procedural and OOP
- [ ] What makes a function "pure"?
- [ ] Difference between compiled and interpreted languages?
- [ ] Why is C faster than Python?
- [ ] When would you use OOP vs Functional programming?
- [ ] What does "first-class functions" mean?
- [ ] Why can Python do both OOP and functional programming?

**Self-Test:** Rewrite a procedural function in OOP style

---

## 📖 Resources

### **Video Tutorials:**
- **Corey Schafer:** OOP in Python
- **freeCodeCamp:** Functional programming explained
- **Computerphile:** Compiled vs Interpreted

### **Reading:**
- **Real Python:** OOP in Python
- **Functional Python:** python-course.eu

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **Backend Developer** | OOP for structuring large applications |
| **Data Engineer** | Functional programming for data pipelines |
| **Full Stack** | Understanding paradigms helps choose right tools |
| **System Programmer** | When to use compiled languages (C/C++) |
| **ML Engineer** | Functional approach for data transformations |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 7!** 🎉

### **Before Day 8:**
1. Push to GitHub
   ```bash
   git add .
   git commit -m "Day 7: Programming Paradigms - OOP, Functional, Compiled vs Interpreted"
   git push
   ```

2. Update Progress Tracker

3. Share:
   ```
   Day 7/30: Programming Paradigms ✅
   
   Implemented UPI payment in 3 different paradigms!
   Procedural vs OOP vs Functional
   
   C is 50x faster than Python, but Python is 50x easier to write 😄
   
   #30DaysOfCode #Programming
   ```

4. **Tomorrow:** Day 8 - OOP Deep Dive (Classes, Inheritance, Polymorphism)

---

**Fun Fact:** WhatsApp backend was originally written in Erlang (functional language) because functional programming makes it easier to handle millions of concurrent connections! 📱

[← Day 6: Algorithmic Thinking](./Day%2006%20-%20Algorithmic%20Thinking.md) | [Day 8: OOP Deep Dive →](./Day%2008%20-%20OOP%20Deep%20Dive.md)
