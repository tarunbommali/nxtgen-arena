# 📅 Day 9: Linear Data Structures - Arrays, Lists, Stacks, Queues

**Module:** Programming & Data Structures (Days 6-10)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - foundational DSA)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- Arrays vs Lists and when to use each
- Stack (LIFO) and Queue (FIFO) concepts
- How Swiggy/Zomato use queues for order processing
- How browser "Back" button uses stacks
- Time complexity of common operations

**Real-world relevance:** Data structures are the building blocks of ALL software. Critical for coding interviews and efficient programming.

---

## 📚 Theory (45-60 minutes)

### **1. Arrays - Contiguous Memory**

```
Array: [45, 12, 89, 23, 67]
Memory: [0][1][2][3][4]  ← Sequential indices

Advantages:
✅ O(1) access by index: arr[2] → instant!
✅ Cache-friendly (contiguous memory)

Disadvantages:
❌ Fixed size (can't grow easily)
❌ Insertion/Deletion slow: O(n)
```

**Indian Example - IRCTC Seat Array:**
```python
# Train compartment with 72 seats
seats = [None] * 72  # Array of 72 elements

# Book seat
seats[15] = "Rajesh Kumar"  # O(1) - instant!

# Check if seat is available
if seats[20] is None:  # O(1)
    seats[20] = "Priya Sharma"

print(f"Seat 15: {seats[15]}")
```

Time Complexity:
- Access: O(1) ✅
- Search: O(n) ⚠️
- Insert/Delete: O(n) ❌

---

### **2. Linked Lists - Node-based**

```
Node: [Data | Next] → [Data | Next] → [Data | Next] → None

Each node points to next node (not contiguous memory)

Advantages:
✅ Dynamic size (grow/shrink easily)
✅ O(1) insertion/deletion at beginning

Disadvantages:
❌ O(n) access by index (must traverse)
❌ Extra memory for pointers
```

**Implementation:**
```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def display(self):
        current = self.head
        while current:
            print(current.data, end=" → ")
            current = current.next
        print("None")

# Test
ll = LinkedList()
ll.insert_at_beginning("Order 3")
ll.insert_at_beginning("Order 2")
ll.insert_at_beginning("Order 1")
ll.display()  # Order 1 → Order 2 → Order 3 → None
```

---

### **3. Stack - LIFO (Last In, First Out)**

```
     Push (add)          Pop (remove)
         │                   ↑
         ▼                   │
    ┌─────────┐         ┌─────────┐
    │ Item 3  │ ← Top   │         │
    ├─────────┤         ├─────────┤
    │ Item 2  │         │ Item 2  │ ← New Top
    ├─────────┤         ├─────────┤
    │ Item 1  │         │ Item 1  │
    └─────────┘         └─────────┘
```

**Real-World Examples:**
1. **Browser Back Button:** Recent → Older pages
2. **Undo/Redo:** Recent action → Older actions
3. **Function Call Stack:** Current function → Previous function

**Indian Example - Swiggy Order Tracking:**
```python
class OrderStack:
    def __init__(self):
        self.orders = []
    
    def place_order(self, order):
        self.orders.append(order)  # Push
        print(f"✓ Order placed: {order}")
    
    def cancel_last_order(self):
        if self.orders:
            cancelled = self.orders.pop()  # Pop
            print(f"✗ Cancelled: {cancelled}")
            return cancelled
        print("❌ No orders to cancel!")
        return None
    
    def view_latest_order(self):
        if self.orders:
            return self.orders[-1]  # Peek
        return None

# Test
stack = OrderStack()
stack.place_order("Biryani from Paradise")
stack.place_order("Pizza from Domino's")
stack.place_order("Burger from McDonald's")

print(f"Latest order: {stack.view_latest_order()}")
stack.cancel_last_order()  # Cancels Burger
stack.cancel_last_order()  # Cancels Pizza
```

**Operations:**
- Push: O(1) ✅
- Pop: O(1) ✅
- Peek: O(1) ✅

---

### **4. Queue - FIFO (First In, First Out)**

```
  Enqueue (add) →               ← Dequeue (remove)
                                         
    ┌─────┬─────┬─────┬─────┐
    │  1  │  2  │  3  │  4  │
    └─────┴─────┴─────┴─────┘
     ↑                       ↑
    Front                   Rear
```

**Real-World Examples:**
1. **Restaurant Order Processing:** First come, first serve
2. **Printer Queue:** Print jobs in order
3. **BFS Algorithm:** Graph traversal

**Indian Example - Zomato Delivery Queue:**
```python
from collections import deque

class DeliveryQueue:
    def __init__(self):
        self.queue = deque()
    
    def add_order(self, order):
        self.queue.append(order)  # Enqueue at rear
        print(f"✓ Order added: {order}")
    
    def assign_to_delivery_partner(self):
        if self.queue:
            order = self.queue.popleft()  # Dequeue from front
            print(f"🛵 Delivering: {order}")
            return order
        print("❌ No pending orders!")
        return None
    
    def view_next_order(self):
        if self.queue:
            return self.queue[0]  # Peek front
        return None
    
    def orders_pending(self):
        return len(self.queue)

# Test
delivery_q = DeliveryQueue()
delivery_q.add_order("Order #101 - Connaught Place")
delivery_q.add_order("Order #102 - Malviya Nagar")
delivery_q.add_order("Order #103 - Hauz Khas")

print(f"Next to deliver: {delivery_q.view_next_order()}")
print(f"Pending: {delivery_q.orders_pending()}")

delivery_q.assign_to_delivery_partner()  # Delivers 101
delivery_q.assign_to_delivery_partner()  # Delivers 102
print(f"Remaining: {delivery_q.orders_pending()}")
```

**Operations:**
- Enqueue: O(1) ✅
- Dequeue: O(1) ✅
- Peek: O(1) ✅

---

### **5. Comparison Table**

| Data Structure | Access | Search | Insert | Delete | Use Case |
|---------------|--------|--------|--------|--------|----------|
| **Array** | O(1) | O(n) | O(n) | O(n) | Fixed-size, fast access |
| **Linked List** | O(n) | O(n) | O(1)* | O(1)* | Dynamic size, frequent modify |
| **Stack** | O(n) | O(n) | O(1) | O(1) | Undo/Redo, function calls |
| **Queue** | O(n) | O(n) | O(1) | O(1) | Order processing, BFS |

*at beginning

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Implement All Structures from Scratch** (40 mins)

**Write `data_structures_implementation.py`:**

```python
# 1. DYNAMIC ARRAY (like Python list)
class DynamicArray:
    def __init__(self):
        self.capacity = 2
        self.size = 0
        self.array = [None] * self.capacity
    
    def append(self, item):
        if self.size == self.capacity:
            self._resize()
        self.array[self.size] = item
        self.size += 1
    
    def _resize(self):
        self.capacity *= 2
        new_array = [None] * self.capacity
        for i in range(self.size):
            new_array[i] = self.array[i]
        self.array = new_array
        print(f"  Resized to capacity {self.capacity}")
    
    def get(self, index):
        if 0 <= index < self.size:
            return self.array[index]
        raise IndexError("Index out of range")
    
    def __str__(self):
        return str([self.array[i] for i in range(self.size)])

# Test
arr = DynamicArray()
for i in range(5):
    arr.append(f"Item {i}")
    print(f"Added Item {i}, Size: {arr.size}, Capacity: {arr.capacity}")


# 2. Stack using List
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Stack is empty")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)


# 3. Queue using List (inefficient - use deque in production)
class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.append(item)  # Add at rear
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)  # Remove from front (O(n)!)
        raise IndexError("Queue is empty")
    
    def peek(self):
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)


# 4. Linked List
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1
    
    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    
    def delete(self, data):
        if not self.head:
            return False
        
        if self.head.data == data:
            self.head = self.head.next
            self.size -= 1
            return True
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                self.size -= 1
                return True
            current = current.next
        return False
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " → ".join(elements) + " → None"

# Test all
print("\n=== Testing All Data Structures ===\n")

# Stack
stack = Stack()
stack.push("Page 1")
stack.push("Page 2")
stack.push("Page 3")
print(f"Stack: {stack.items}")
print(f"Back button: {stack.pop()}")
print(f"After back: {stack.items}\n")

# Queue
queue = Queue()
queue.enqueue("Customer 1")
queue.enqueue("Customer 2")
queue.enqueue("Customer 3")
print(f"Queue: {queue.items}")
print(f"Serve: {queue.dequeue()}")
print(f"After serve: {queue.items}\n")

# Linked List
ll = LinkedList()
ll.append("A")
ll.append("B")
ll.append("C")
ll.insert_at_beginning("START")
print(f"Linked List: {ll.display()}")
ll.delete("B")
print(f"After delete B: {ll.display()}")
```

---

### **Task 2: Solve Real Problems** (30 mins)

**Problem 1: Valid Parentheses (Stack)**
```python
def is_valid_parentheses(s):
    """
    Check if brackets are balanced
    Example: "({[]})" → True, "({[})" → False
    """
    stack = []
    matching = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in ')}]':
            if not stack or stack.pop() != matching[char]:
                return False
    
    return len(stack) == 0

# Test
test_cases = [
    "({[]})",      # True
    "({[})",       # False
    "((()))",      # True
    "(((",          # False
    "{[()]}",      # True
]

for test in test_cases:
    result = is_valid_parentheses(test)
    print(f"{test:15} → {result}")
```

**Problem 2: Reverse a String (Stack)**
```python
def reverse_string(s):
    """Use stack to reverse"""
    stack = list(s)  # Each char goes to stack
    reversed_str = ''
    
    while stack:
        reversed_str += stack.pop()
    
    return reversed_str

print(reverse_string("INDIA"))  # AIDNI
print(reverse_string("नमस्ते"))  # ेत्समन
```

**Problem 3: First Non-Repeating Character (Queue + Hash)**
```python
from collections import deque, defaultdict

def first_non_repeating(stream):
    """
    Print first non-repeating character as stream comes
    Example: "aabbc" → a, -1, -1, b, b
    """
    queue = deque()
    freq = defaultdict(int)
    
    result = []
    for char in stream:
        freq[char] += 1
        queue.append(char)
        
        # Remove repeated chars from front
        while queue and freq[queue[0]] > 1:
            queue.popleft()
        
        if queue:
            result.append(queue[0])
        else:
            result.append('-1')
    
    return result

print(first_non_repeating("aabbc"))
# ['a', '-1', '-1', 'b', 'b']
```

---

### **Task 3: Performance Comparison** (20 mins)

**Write `ds_performance_test.py`:**

```python
import time
from collections import deque

def test_list_vs_deque():
    """Compare list vs deque for queue operations"""
    n = 100000
    
    # Test 1: Using list (inefficient)
    start = time.time()
    queue_list = []
    for i in range(n):
        queue_list.append(i)
    for i in range(n):
        queue_list.pop(0)  # O(n) operation!
    list_time = time.time() - start
    
    # Test 2: Using deque (efficient)
    start = time.time()
    queue_deque = deque()
    for i in range(n):
        queue_deque.append(i)
    for i in range(n):
        queue_deque.popleft()  # O(1) operation!
    deque_time = time.time() - start
    
    print(f"List as queue: {list_time:.4f}s")
    print(f"Deque as queue: {deque_time:.4f}s")
    print(f"Deque is {list_time/deque_time:.0f}x faster!")

test_list_vs_deque()
```

---

### **Task 4: Indian Railways Waiting List System** (25 mins)

**Simulate IRCTC booking with Queue:**

```python
from collections import deque
from enum import Enum

class TicketStatus(Enum):
    CONFIRMED = "CNF"
    RAC = "RAC"
    WAITING = "WL"

class Passenger:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.status = None
        self.seat_number = None

class IRCTCBookingSystem:
    def __init__(self, total_seats=10, rac_seats=2):
        self.total_seats = total_seats
        self.rac_seats = rac_seats
        
        self.confirmed = []
        self.rac_queue = deque(maxlen=rac_seats)
        self.waiting_queue = deque()
        
        self.confirmed_count = 0
        self.rac_count = 0
        self.waiting_count = 0
    
    def book_ticket(self, passenger):
        # Try confirmed
        if self.confirmed_count < self.total_seats:
            passenger.status = TicketStatus.CONFIRMED
            passenger.seat_number = self.confirmed_count + 1
            self.confirmed.append(passenger)
            self.confirmed_count += 1
            print(f"✓ {passenger.name}: {passenger.status.value}/{passenger.seat_number}")
            return passenger.status
        
        # Try RAC
        elif self.rac_count < self.rac_seats:
            passenger.status = TicketStatus.RAC
            passenger.seat_number = f"RAC-{self.rac_count + 1}"
            self.rac_queue.append(passenger)
            self.rac_count += 1
            print(f"⚠️  {passenger.name}: {passenger.status.value}/{passenger.seat_number}")
            return passenger.status
        
        # Waiting list
        else:
            passenger.status = TicketStatus.WAITING
            self.waiting_count += 1
            passenger.seat_number = f"WL-{self.waiting_count}"
            self.waiting_queue.append(passenger)
            print(f"❌ {passenger.name}: {passenger.status.value}/{passenger.seat_number}")
            return passenger.status
    
    def cancel_ticket(self, passenger_name):
        # Find and cancel
        for i, p in enumerate(self.confirmed):
            if p.name == passenger_name:
                seat = p.seat_number
                del self.confirmed[i]
                self.confirmed_count -= 1
                print(f"\n✗ Cancelled: {passenger_name} (Seat {seat})")
                
                # Promote RAC to confirmed
                if self.rac_queue:
                    promoted = self.rac_queue.popleft()
                    promoted.status = TicketStatus.CONFIRMED
                    promoted.seat_number = seat
                    self.confirmed.append(promoted)
                    self.confirmed_count += 1
                    self.rac_count -= 1
                    print(f"↑ Promoted from RAC: {promoted.name} → CNF/{seat}")
                    
                    # Promote WL to RAC
                    if self.waiting_queue:
                        promoted = self.waiting_queue.popleft()
                        promoted.status = TicketStatus.RAC
                        promoted.seat_number = f"RAC-{self.rac_count + 1}"
                        self.rac_queue.append(promoted)
                        self.rac_count += 1
                        print(f"↑ Promoted from WL: {promoted.name} → RAC")
                
                return True
        return False
    
    def print_status(self):
        print("\n=== Booking Status ===")
        print(f"Confirmed: {self.confirmed_count}/{self.total_seats}")
        print(f"RAC: {self.rac_count}/{self.rac_seats}")
        print(f"Waiting: {len(self.waiting_queue)}")

# Test
print("=== IRCTC Booking Simulation ===\n")
irctc = IRCTCBookingSystem(total_seats=3, rac_seats=2)

# Book tickets
passengers = [
    Passenger("Rajesh", 30),
    Passenger("Priya", 25),
    Passenger("Amit", 35),
    Passenger("Sneha", 28),
    Passenger("Vikram", 32),
    Passenger("Anjali", 26),
    Passenger("Rahul", 29),
]

for p in passengers:
    irctc.book_ticket(p)

irctc.print_status()

# Cancel a confirmed ticket
irctc.cancel_ticket("Priya")
irctc.print_status()
```

---

### **Task 5: Browser History (Stack + Queue)** (15 mins)

```python
class BrowserHistory:
    def __init__(self):
        self.history = []  # Stack for back
        self.forward_stack = []  # Stack for forward
    
    def visit(self, url):
        self.history.append(url)
        self.forward_stack = []  # Clear forward on new visit
        print(f"Visited: {url}")
    
    def back(self):
        if len(self.history) > 1:
            current = self.history.pop()
            self.forward_stack.append(current)
            print(f"Back to: {self.history[-1]}")
            return self.history[-1]
        print("Can't go back!")
        return self.history[-1] if self.history else None
    
    def forward(self):
        if self.forward_stack:
            url = self.forward_stack.pop()
            self.history.append(url)
            print(f"Forward to: {url}")
            return url
        print("Can't go forward!")
        return None
    
    def current(self):
        return self.history[-1] if self.history else None

# Test
browser = BrowserHistory()
browser.visit("google.com")
browser.visit("youtube.com")
browser.visit("github.com")
print(f"Current: {browser.current()}")

browser.back()
browser.back()
browser.forward()
print(f"Current: {browser.current()}")
```

---

## ✅ Verification Checklist

Before moving to Day 10, ensure you can answer:

- [ ] What's the difference between array and linked list?
- [ ] Explain LIFO and FIFO with examples
- [ ] When to use stack vs queue?
- [ ] Time complexity of stack/queue operations?
- [ ] How does browser back button work? (Data structure used)
- [ ] How would you implement undo/redo?
- [ ] Why is deque better than list for queue?

**Self-Test:** Implement a text editor with undo/redo using stacks

---

## 📖 Resources

### **Visualizations:**
- **VisuAlgo:** Visualize all data structures
- **CS50 Shorts:** Data structures videos

### **Practice:**
- **LeetCode:** Easy stack/queue problems
- **HackerRank:** Data structures track

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **All Coding Interviews** | 30% of problems use these structures |
| **Backend Developer** | Request queues, caching (LRU = queue + hash) |
| **Frontend Developer** | Browser history, undo/redo |
| **System Design** | Message queues (Kafka = queue at scale) |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 9!** 🎉

Tomorrow: **Day 10 - Trees, Graphs, Hash Maps** (Final day of Module 2!)

[← Day 8: OOP](./Day%2008%20-%20OOP%20Deep%20Dive.md) | [Day 10: Non-Linear DS →](./Day%2010%20-%20Data%20Structures%20II%20(Non-Linear).md)
