# 📅 Day 8: Object-Oriented Programming Deep Dive

**Module:** Programming & Data Structures (Days 6-10)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - important concepts)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- The 4 pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism)
- How to design class hierarchies
- SOLID principles basics
- Common design patterns
- When and why to use OOP

**Real-world relevance:** OOP is the dominant paradigm in enterprise software. Understanding it well is CRITICAL for backend, full-stack, and most software engineering roles.

---

## 📚 Theory (45-60 minutes)

### **1. The 4 Pillars of OOP**

```
   ┌─────────────────────────────────────┐
   │     OBJECT-ORIENTED PROGRAMMING     │
   │                                     │
   │  ┌──────────┐    ┌──────────┐     │
   │  │Encapsu-  │    │Abstract- │     │
   │  │lation    │    │ion       │     │
   │  └──────────┘    └──────────┘     │
   │                                     │
   │  ┌──────────┐    ┌──────────┐     │
   │  │Inherit-  │    │Polymor-  │     │
   │  │ance      │    │phism     │     │
   │  └──────────┘    └──────────┘     │
   └─────────────────────────────────────┘
```

---

### **2. Pillar 1: Encapsulation - Data Hiding**

**Idea:** Bundle data and methods together, hide internal details

**Indian Example - Swiggy Order:**

```python
class SwiggyOrder:
    def __init__(self, order_id, restaurant):
        self.order_id = order_id
        self.restaurant = restaurant
        self.__payment_details = {}  # Private (hidden)
        self._delivery_partner = None  # Protected
        self.status = "Pending"  # Public
    
    # Public method
    def place_order(self, items, payment_method):
        self.__process_payment(payment_method)  # Internal detail hidden
        self._assign_delivery_partner()  # Internal detail hidden
        self.status = "Confirmed"
        print(f"✓ Order #{self.order_id} placed at {self.restaurant}")
    
    # Private method (starts with __)
    def __process_payment(self, payment_method):
        # Complex payment logic hidden from outside
        self.__payment_details = {
            'method': payment_method,
            'status': 'paid'
        }
        print(f"  Payment processed via {payment_method}")
    
    # Protected method (starts with _)
    def _assign_delivery_partner(self):
        self._delivery_partner = "Delivery Partner #123"
        print(f"  Assigned to {self._delivery_partner}")
    
    # Getter (read-only access to private data)
    def get_payment_status(self):
        return self.__payment_details.get('status', 'not processed')

# Usage
order = SwiggyOrder("ORD001", "Domino's Pizza")
order.place_order(["Margherita Pizza"], "UPI")

print(f"Status: {order.status}")  # Can access public
print(f"Payment: {order.get_payment_status()}")  # Can access via getter

# order.__payment_details  # ERROR! Can't access private directly
# This protects sensitive data from being modified incorrectly
```

**Benefits:**
- ✅ Data protection (can't accidentally break internals)
- ✅ Easier to change internals without affecting external code
- ✅ Security (payment details can't be tampered with)

---

### **3. Pillar 2: Abstraction - Hide Complexity**

**Idea:** Show only essential features, hide implementation details

**Indian Example - PhonePe UPI:**

```python
from abc import ABC, abstractmethod

# Abstract class (blueprint)
class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount):
        """Every payment gateway must implement this"""
        pass
    
    @abstractmethod
    def verify_status(self, transaction_id):
        """Every payment gateway must implement this"""
        pass

# Concrete implementation 1
class UPIPayment(PaymentGateway):
    def process_payment(self, amount):
        print(f"Processing ₹{amount} via UPI...")
        print("  → Connecting to NPCI")
        print("  → Verifying UPI PIN")
        print("  → Transferring funds")
        return {"status": "success", "txn_id": "UPI12345"}
    
    def verify_status(self, transaction_id):
        return "Completed"

# Concrete implementation 2
class CreditCardPayment(PaymentGateway):
    def process_payment(self, amount):
        print(f"Processing ₹{amount} via Credit Card...")
        print("  → Connecting to bank")
        print("  → Validating card")
        print("  → Processing through Visa network")
        return {"status": "success", "txn_id": "CC67890"}
    
    def verify_status(self, transaction_id):
        return "Completed"

# High-level code doesn't care about payment internals
def checkout(cart_total, payment_gateway: PaymentGateway):
    print(f"Cart Total: ₹{cart_total}")
    result = payment_gateway.process_payment(cart_total)
    print(f"✓ Payment successful! Transaction ID: {result['txn_id']}\n")

# Usage - Same interface, different implementations
upi = UPIPayment()
card = CreditCardPayment()

checkout(1500, upi)   # Uses UPI internally
checkout(2500, card)  # Uses Card internally
```

**Benefits:**
- ✅ User doesn't need to know HOW payment works
- ✅ Easy to add new payment methods (Wallet, Net Banking) without changing checkout code
- ✅ Reduces complexity for developers

---

### **4. Pillar 3: Inheritance - Code Reuse**

**Idea:** Create new classes based on existing classes

**Indian E-commerce Example:**

```python
# Base class (Parent)
class Product:
    def __init__(self, name, price, seller):
        self.name = name
        self.price = price
        self.seller = seller
        self.in_stock = True
    
    def display_info(self):
        print(f"{self.name} - ₹{self.price}")
        print(f"Sold by: {self.seller}")
        print(f"Stock: {'Available' if self.in_stock else 'Out of Stock'}")
    
    def apply_discount(self, percent):
        self.price = self.price * (1 - percent/100)
        print(f"Discount applied! New price: ₹{self.price}")

# Child class 1 (inherits from Product)
class ElectronicsProduct(Product):
    def __init__(self, name, price, seller, warranty_years):
        super().__init__(name, price, seller)  # Call parent constructor
        self.warranty_years = warranty_years
    
    def display_info(self):
        super().display_info()  # Call parent method
        print(f"Warranty: {self.warranty_years} years")
    
    def extend_warranty(self, extra_years):
        self.warranty_years += extra_years
        print(f"Warranty extended to {self.warranty_years} years")

# Child class 2
class ClothingProduct(Product):
    def __init__(self, name, price, seller, size, color):
        super().__init__(name, price, seller)
        self.size = size
        self.color = color
    
    def display_info(self):
        super().display_info()
        print(f"Size: {self.size}, Color: {self.color}")
    
    def check_size_available(self, size):
        return size == self.size

# Usage
laptop = ElectronicsProduct("Dell Laptop", 45000, "Flipkart", 1)
laptop.display_info()
print()
laptop.extend_warranty(1)
print()

tshirt = ClothingProduct("Nike T-Shirt", 1500, "Amazon", "L", "Blue")
tshirt.display_info()
tshirt.apply_discount(20)  # Inherited method works!
```

**Benefits:**
- ✅ Code reuse (don't repeat common logic)
- ✅ Logical hierarchy models real world
- ✅ Easy to maintain and extend

---

### **5. Pillar 4: Polymorphism - Many Forms**

**Idea:** Same interface, different implementations

**Types:**

#### **A. Method Overriding (Runtime)**
```python
class DeliveryService:
    def calculate_fee(self, distance):
        return distance * 10

class PrimeDelivery(DeliveryService):
    def calculate_fee(self, distance):
        return 0  # Free delivery for Prime!

class ExpressDelivery(DeliveryService):
    def calculate_fee(self, distance):
        return distance * 20  # Higher rate

# Polymorphism in action
def process_order(distance, delivery_service: DeliveryService):
    fee = delivery_service.calculate_fee(distance)
    print(f"Delivery fee: ₹{fee}")

regular = DeliveryService()
prime = PrimeDelivery()
express = ExpressDelivery()

process_order(5, regular)   # ₹50
process_order(5, prime)     # ₹0
process_order(5, express)   # ₹100
```

#### **B. Method Overloading (Compile-time - not directly in Python)**
Python uses default parameters instead:
```python
class Restaurant:
    def order(self, item, quantity=1, special_instructions=""):
        print(f"Ordered {quantity}x {item}")
        if special_instructions:
            print(f"Note: {special_instructions}")

restaurant = Restaurant()
restaurant.order("Biryani")  # Default quantity=1
restaurant.order("Biryani", 2)  # quantity=2
restaurant.order("Biryani", 2, "Extra spicy")  # All parameters
```

---

### **6. SOLID Principles (Basics)**

**S - Single Responsibility Principle**
```python
# BAD: Class doing too many things
class Order:
    def calculate_total(self): pass
    def send_email(self): pass  # Email is separate responsibility!
    def save_to_database(self): pass  # Database is separate!

# GOOD: Each class has one job
class Order:
    def calculate_total(self): pass

class EmailService:
    def send_order_confirmation(self, order): pass

class OrderRepository:
    def save(self, order): pass
```

**O - Open/Closed Principle**
```python
# Open for extension, closed for modification
class DiscountCalculator:
    def calculate(self, price, discount_type):
        # Bad: need to modify this every time new discount added
        if discount_type == "percentage":
            return price * 0.9
        elif discount_type == "fixed":
            return price - 100
        # What if we add "buy1get1"? Need to modify this code!

# BETTER: Use polymorphism
class Discount(ABC):
    @abstractmethod
    def apply(self, price): pass

class PercentageDiscount(Discount):
    def __init__(self, percent):
        self.percent = percent
    
    def apply(self, price):
        return price * (1 - self.percent/100)

class FixedDiscount(Discount):
    def __init__(self, amount):
        self.amount = amount
    
    def apply(self, price):
        return price - self.amount

# Adding new discount types doesn't modify existing code!
class Buy1Get1Discount(Discount):
    def apply(self, price):
        return price / 2
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Design a Banking System** (30 mins)

**Write `banking_system_oop.py`:**

```python
from abc import ABC, abstractmethod
from datetime import datetime

# Base class
class BankAccount(ABC):
    account_counter = 1000  # Class variable
    
    def __init__(self, account_holder, initial_balance=0):
        self.account_number = BankAccount.account_counter
        BankAccount.account_counter += 1
        self.account_holder = account_holder
        self._balance = initial_balance  # Protected
        self.transactions = []
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            self._record_transaction("Deposit", amount)
            print(f"✓ Deposited ₹{amount}")
            return True
        return False
    
    @abstractmethod
    def withdraw(self, amount):
        """Each account type has different withdrawal rules"""
        pass
    
    def get_balance(self):
        return self._balance
    
    def _record_transaction(self, txn_type, amount):
        self.transactions.append({
            'type': txn_type,
            'amount': amount,
            'date': datetime.now(),
            'balance': self._balance
        })
    
    def print_statement(self):
        print(f"\n=== Statement for {self.account_holder} ===")
        print(f"Account Number: {self.account_number}")
        print(f"Current Balance: ₹{self._balance}\n")
        print("Recent Transactions:")
        for txn in self.transactions[-5:]:  # Last 5
            print(f"  {txn['date'].strftime('%Y-%m-%d %H:%M')} | "
                  f"{txn['type']:10} | ₹{txn['amount']:8} | "
                  f"Balance: ₹{txn['balance']}")

# Savings Account (child class)
class SavingsAccount(BankAccount):
    MINIMUM_BALANCE = 1000
    INTEREST_RATE = 0.04  # 4% per annum
    
    def withdraw(self, amount):
        if amount <= 0:
            print("❌ Invalid amount")
            return False
        
        if self._balance - amount < self.MINIMUM_BALANCE:
            print(f"❌ Cannot withdraw! Minimum balance ₹{self.MINIMUM_BALANCE} required")
            return False
        
        self._balance -= amount
        self._record_transaction("Withdrawal", amount)
        print(f"✓ Withdrawn ₹{amount}")
        return True
    
    def apply_interest(self):
        interest = self._balance * self.INTEREST_RATE
        self.deposit(interest)
        print(f"✓ Interest credited: ₹{interest:.2f}")

# Current Account (child class)
class CurrentAccount(BankAccount):
    OVERDRAFT_LIMIT = 10000
    
    def withdraw(self, amount):
        if amount <= 0:
            print("❌ Invalid amount")
            return False
        
        if amount > self._balance + self.OVERDRAFT_LIMIT:
            print(f"❌ Exceeds overdraft limit of ₹{self.OVERDRAFT_LIMIT}")
            return False
        
        self._balance -= amount
        self._record_transaction("Withdrawal", amount)
        print(f"✓ Withdrawn ₹{amount}")
        
        if self._balance < 0:
            print(f"⚠️  Using overdraft: ₹{abs(self._balance)}")
        
        return True

# Testing
print("=== INDIAN BANKING SYSTEM ===\n")

# Create accounts
savings = SavingsAccount("Rajesh Kumar", 5000)
current = CurrentAccount("Sharma Enterprises", 20000)

# Savings account operations
print("--- Savings Account ---")
savings.deposit(2000)
savings.withdraw(500)
savings.withdraw(7000)  # Should fail (min balance)
savings.apply_interest()
savings.print_statement()

# Current account operations
print("\n\n--- Current Account ---")
current.deposit(5000)
current.withdraw(22000)  # Should work (overdraft)
current.withdraw(10000)  # Should fail (exceeds limit)
current.print_statement()
```

---

### **Task 2: E-Commerce System with Design Patterns** (35 mins)

**Implement Singleton Pattern (single instance only):**

```python
class ShoppingCart:
    """Singleton: Only one cart per user session"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.items = []
            cls._instance.user = None
        return cls._instance
    
    def add_item(self, product, quantity=1):
        self.items.append({'product': product, 'quantity': quantity})
        print(f"✓ Added {quantity}x {product['name']} to cart")
    
    def get_total(self):
        return sum(item['product']['price'] * item['quantity'] 
                   for item in self.items)
    
    def clear(self):
        self.items = []
        print("Cart cleared")

# Test Singleton
cart1 = ShoppingCart()
cart1.add_item({'name': 'iPhone', 'price': 80000}, 1)

cart2 = ShoppingCart()  # Same instance!
cart2.add_item({'name': 'AirPods', 'price': 20000}, 1)

print(f"\nCart1 items: {len(cart1.items)}")  # 2
print(f"Cart2 items: {len(cart2.items)}")  # 2 (same cart!)
print(f"Same object? {cart1 is cart2}")  # True
```

**Implement Factory Pattern:**

```python
# Factory Pattern: Create objects without exposing creation logic

class Notification(ABC):
    @abstractmethod
    def send(self, message): pass

class SMSNotification(Notification):
    def send(self, message):
        print(f"📱 SMS: {message}")

class EmailNotification(Notification):
    def send(self, message):
        print(f"📧 Email: {message}")

class PushNotification(Notification):
    def send(self, message):
        print(f"🔔 Push: {message}")

# Factory
class NotificationFactory:
    @staticmethod
    def create_notification(notification_type):
        if notification_type == "sms":
            return SMSNotification()
        elif notification_type == "email":
            return EmailNotification()
        elif notification_type == "push":
            return PushNotification()
        else:
            raise ValueError("Invalid notification type")

# Usage
def send_order_confirmation(user_preference):
    notifier = NotificationFactory.create_notification(user_preference)
    notifier.send("Your order has been confirmed!")

send_order_confirmation("sms")
send_order_confirmation("email")
send_order_confirmation("push")
```

---

### **Task 3: Practice Inheritance Hierarchy** (20 mins)

**Design class hierarchy for Indian food delivery app:**

```python
# YOUR TASK: Complete this hierarchy

class Restaurant:
    def __init__(self, name, location, rating):
        self.name = name
        self.location = location
        self.rating = rating
        self.menu = []
    
    def add_menu_item(self, item):
        self.menu.append(item)
    
    def display_menu(self):
        print(f"\n--- {self.name} Menu ---")
        for item in self.menu:
            print(f"  {item.name}: ₹{item.price}")

class FastFoodRestaurant(Restaurant):
    def __init__(self, name, location, rating, delivery_time):
        super().__init__(name, location, rating)
        self.delivery_time = delivery_time
    
    def quick_order(self, item_name):
        print(f"Quick order for {item_name} - Ready in {self.delivery_time} mins!")

class FineD iningRestaurant(Restaurant):
    def __init__(self, name, location, rating, chef_name):
        super().__init__(name, location, rating)
        self.chef_name = chef_name
        self.table_booking_required = True
    
    def book_table(self, time, guests):
        print(f"✓ Table booked for {guests} guests at {time}")

# TODO: Add these classes:
# 1. CloudKitchen (no dine-in, delivery only)
# 2. CafeRestaurant (specializes in beverages and snacks)
# 3. StreetFoodVendor (cheap, fast, no seating)

# Test your classes here!
```

---

### **Task 4: Encapsulation Practice** (15 mins)

**Create a secure UPI PIN system:**

```python
class UPIAccount:
    def __init__(self, upi_id):
        self.upi_id = upi_id
        self.__pin = None  # Private!
        self.__pin_attempts = 0
        self.__is_locked = False
    
    def set_pin(self, new_pin):
        """Set PIN (only once or with old PIN verification)"""
        if len(str(new_pin)) != 4:
            print("❌ PIN must be 4 digits")
            return False
        
        if self.__pin is None:
            self.__pin = new_pin
            print("✓ PIN set successfully")
            return True
        else:
            print("❌ PIN already set. Use change_pin()")
            return False
    
    def change_pin(self, old_pin, new_pin):
        """Change PIN with verification"""
        if self.__verify_pin(old_pin):
            self.__pin = new_pin
            print("✓ PIN changed successfully")
            return True
        return False
    
    def __verify_pin(self, entered_pin):
        """Private method - only accessible within class"""
        if self.__is_locked:
            print("❌ Account locked! Contact support")
            return False
        
        if entered_pin == self.__pin:
            self.__pin_attempts = 0  # Reset attempts
            return True
        else:
            self.__pin_attempts += 1
            remaining = 3 - self.__pin_attempts
            
            if self.__pin_attempts >= 3:
                self.__is_locked = True
                print("❌ Account locked due to multiple failed attempts!")
            else:
                print(f"❌ Wrong PIN! {remaining} attempts remaining")
            
            return False
    
    def make_payment(self, amount, entered_pin):
        """Public method using private verification"""
        if self.__verify_pin(entered_pin):
            print(f"✓ Payment of ₹{amount} successful!")
            return True
        return False

# Test
account = UPIAccount("user@paytm")
account.set_pin(1234)

account.make_payment(500, 1111)  # Wrong
account.make_payment(500, 2222)  # Wrong
account.make_payment(500, 3333)  # Wrong - Account locked!
account.make_payment(500, 1234)  # Can't access anymore

# account.__pin  # Can't access private variable!
```

---

### **Task 5: Documentation - Compare approaches** (10 mins)

**Write `day08_oop_reflection.md`:**

```markdown
# OOP vs Procedural: When to use what?

## Procedural is better for:
1. [Your answer]
2. [Your answer]

## OOP is better for:
1. [Your answer]
2. [Your answer]

## Real examples from your experience:
- A time when OOP helped: [...]
- A time when procedural was simpler: [...]

## SOLID Principles - Why they matter:
[Explain in your own words]
```

---

## ✅ Verification Checklist

Before moving to Day 9, ensure you can answer:

- [ ] What are the 4 pillars of OOP?
- [ ] Explain encapsulation with an example
- [ ] What's the difference between abstraction and encapsulation?
- [ ] When should you use inheritance vs composition?
- [ ] What is polymorphism? Give 2 types.
- [ ] Explain Single Responsibility Principle
- [ ] What is a design pattern? Name 2.
- [ ] Why use private variables (`__variable`)?

**Self-Test:** Design a class hierarchy for an Indian railway booking system (Train, PassengerTrain, GoodsTrain, etc.)

---

## 📖 Resources

### **Video Tutorials:**
- **Corey Schafer:** OOP series (Python)
- **freeCodeCamp:** OOP explained
- **Tech With Tim:** Design patterns

### **Reading:**
- **Real Python:** OOP in Python
- **Refactoring Guru:** Design patterns
- **Clean Code:** Robert C. Martin

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **Backend Developer** | API design, service architecture |
| **Full Stack** | Frontend components, backend models |
| **Game Developer** | Game entities, character hierarchies |
| **Enterprise Software** | Large codebases REQUIRE good OOP |
| **System Design** | Modeling complex systems |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 8!** 🎉

### **Before Day 9:**
1. Push to GitHub
   ```bash
   git add .
   git commit -m "Day 8: OOP Deep Dive - 4 Pillars, SOLID, Design Patterns"
   git push
   ```

2. Update Progress Tracker

3. Share:
   ```
   Day 8/30: Object-Oriented Programming ✅
   
   Built a complete banking system with OOP!
   Savings, Current accounts with different withdrawal rules
   
   Singleton & Factory patterns implemented
   
   #30DaysOfCode #OOP
   ```

4. **Tomorrow:** Day 9 - Data Structures I (Arrays, Lists, Stacks, Queues)

---

**Fun Fact:** Java was designed to be purely OOP (everything is an object!), while Python is multi-paradigm (OOP + Functional + Procedural). Flexibility FTW! 🐍

[← Day 7: Programming Paradigms](./Day%2007%20-%20Programming%20Paradigms.md) | [Day 9: Data Structures I →](./Day%2009%20-%20Data%20Structures%20I%20(Linear).md)
