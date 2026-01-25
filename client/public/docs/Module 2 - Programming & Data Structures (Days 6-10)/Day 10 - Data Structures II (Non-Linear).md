# 📅 Day 10: Non-Linear Data Structures - Trees, Graphs, Hash Maps

**Module:** Programming & Data Structures (Days 6-10)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - complex structures)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- Binary Trees and Binary Search Trees (BST)
- Graphs and their real-world applications
- Hash Maps/Dictionaries and why they're O(1)
- When to use which data structure
- Complete Module 2! 🎉

**Real-world relevance:** These are the MOST powerful data structures. Google Search uses graphs, databases use trees, dictionaries are everywhere!

---

## 📚 Theory (45-60 minutes)

### **1. Binary Trees - Hierarchical Structure**

```
        [10]           ← Root
       /    \
    [5]      [15]      ← Level 1
   /  \      /  \
 [3]  [7] [12] [18]    ← Level 2 (Leaves)
```

**Terms:**
- **Root:** Top node (10)
- **Parent:** Node with children (5 is parent of 3, 7)
- **Child:** Node below parent
- **Leaf:** Node with no children (3, 7, 12, 18)
- **Height:** Max levels (3 in this case)

**Indian Example - Organization Chart:**
```
           [CEO]
          /      \
    [CTO]         [CFO]
    /    \         /   \
[DevHead] [QAHead] [...]  [...]
```

---

### **2. Binary Search Tree (BST) - Ordered Tree**

**Rule:** Left < Parent < Right

```
        [50]
       /    \
    [30]    [70]
   /  \     /  \
 [20][40][60][80]

All nodes in left subtree < 50
All nodes in right subtree > 50
```

**Why BST?** Search in O(log n) time!

**Implementation:**
```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)
    
    def search(self, value):
        return self._search_recursive(self.root, value)
    
    def _search_recursive(self, node, value):
        if node is None:
            return False
        if node.value == value:
            return True
        elif value < node.value:
            return self._search_recursive(node.left, value)
        else:
            return self._search_recursive(node.right, value)
    
    def inorder_traversal(self, node=None, result=None):
        """Left → Root → Right (gives sorted order!)"""
        if result is None:
            result = []
            node = self.root
        
        if node:
            self.inorder_traversal(node.left, result)
            result.append(node.value)
            self.inorder_traversal(node.right, result)
        
        return result

# Test
bst = BinarySearchTree()
values = [50, 30, 70, 20, 40, 60, 80]
for val in values:
    bst.insert(val)

print(f"Inorder (sorted): {bst.inorder_traversal()}")
print(f"Search 40: {bst.search(40)}")  # True
print(f"Search 100: {bst.search(100)}")  # False
```

**Real Use:** Database indexing uses B-Trees (variant of BST)!

---

### **3. Graphs - Networks of Nodes**

**Types:**

#### **Undirected Graph** (Facebook Friends)
```
    A ─── B
    │     │
    │     │
    C ─── D
```
If A is friends with B, then B is friends with A.

#### **Directed Graph** (Instagram Followers)
```
    A ──→ B
    ↑     ↓
    │     │
    C ←── D
```
A follows B, but B might not follow A back.

#### **Weighted Graph** (Google Maps - distances)
```
      5km      3km
    A ─── B ─── C
    │           │
  2km│           │4km
    │           │
    D ─────────E
        6km
```

---

**Implementation - Adjacency List (most common):**
```python
class Graph:
    def __init__(self):
        self.graph = {}  # {node: [neighbors]}
    
    def add_edge(self, u, v, directed=False):
        """Add edge from u to v"""
        if u not in self.graph:
            self.graph[u] = []
        self.graph[u].append(v)
        
        if not directed:  # Undirected - add reverse edge
            if v not in self.graph:
                self.graph[v] = []
            self.graph[v].append(u)
    
    def bfs(self, start):
        """Breadth-First Search"""
        from collections import deque
        visited = set()
        queue = deque([start])
        result = []
        
        while queue:
            node = queue.popleft()
            if node not in visited:
                visited.add(node)
                result.append(node)
                
                for neighbor in self.graph.get(node, []):
                    if neighbor not in visited:
                        queue.append(neighbor)
        
        return result
    
    def dfs(self, start, visited=None, result=None):
        """Depth-First Search"""
        if visited is None:
            visited = set()
            result = []
        
        visited.add(start)
        result.append(start)
        
        for neighbor in self.graph.get(start, []):
            if neighbor not in visited:
                self.dfs(neighbor, visited, result)
        
        return result

# Indian Example: Metro Rail Network
metro = Graph()
metro.add_edge("Rajiv Chowk", "Connaught Place")
metro.add_edge("Rajiv Chowk", "Barakhamba Road")
metro.add_edge("Connaught Place", "Patel Chowk")
metro.add_edge("Barakhamba Road", "Mandi House")

print("BFS from Rajiv Chowk:", metro.bfs("Rajiv Chowk"))
print("DFS from Rajiv Chowk:", metro.dfs("Rajiv Chowk"))
```

**Real Applications:**
- **Social Networks:** Find mutual friends, suggest connections
- **Maps:** Google Maps (Dijkstra's algorithm for shortest path)
- **Web Crawlers:** Follow links between pages
- **Recommendation Systems:** Netflix, Amazon

---

### **4. Hash Maps (Dictionaries) - O(1) Magic!**

**How Hash Maps Work:**
```
Key → Hash Function → Index in array

Example:
"apple"  → hash("apple")  → 5 → store value at index 5
"banana" → hash("banana") → 12 → store value at index 12
```

**Collision Handling - Chaining:**
```
Index:  [0] → None
       [1] → None
       [2] → [("apple", 100) → ("apricot", 50)]  ← Collision!
       [3] → [("banana", 200)]
       ...
```

**Python dict is a hash map:**
```python
# O(1) operations!
prices = {
    "iPhone": 80000,
    "Samsung": 50000,
    "OnePlus": 40000
}

prices["iPhone"]  # O(1) - instant lookup!
prices["Pixel"] = 60000  # O(1) - instant insert!
```

**Indian Example - Aadhaar Lookup:**
```python
# Imagine 1 billion Aadhaar numbers
# Array would be O(n) = 1 billion comparisons!
# Hash map is O(1) = instant!

aadhaar_db = {
    "1234-5678-9012": {"name": "Rajesh Kumar", "city": "Delhi"},
    "9876-5432-1011": {"name": "Priya Sharma", "city": "Mumbai"},
    # ... 1 billion more
}

# Instant lookup!
person = aadhaar_db["1234-5678-9012"]  # O(1)
print(person)
```

**When to use Hash Map:**
- ✅ Need fast lookup by key
- ✅ Counting frequency
- ✅ Checking existence
- ✅ Caching/memoization

---

### **5. Decision Tree - Which Data Structure to Use?**

```
Need to store data?
│
├─ Need fast search by key?
│  └─ YES → Hash Map (dict) - O(1)
│  
├─ Need sorted order?
│  └─ YES → Binary Search Tree - O(log n)
│  
├─ Need hierarchy (parent-child)?
│  └─ YES → Tree
│  
├─ Need relationships/networks?
│  └─ YES → Graph
│  
├─ Need FIFO processing?
│  └─ YES → Queue
│  
├─ Need LIFO (undo/redo)?
│  └─ YES → Stack
│  
└─ Just sequential access?
   └─ YES → Array/List
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: File System Tree** (25 mins)

**Represent a file system using Tree:**

```python
class FileNode:
    def __init__(self, name, is_file=False, size=0):
        self.name = name
        self.is_file = is_file
        self.size = size  # in KB
        self.children = []  # subdirectories/files
    
    def add_child(self, child):
        self.children.append(child)
    
    def get_total_size(self):
        """Calculate total size recursively"""
        if self.is_file:
            return self.size
        
        total = 0
        for child in self.children:
            total += child.get_total_size()
        return total
    
    def display(self, indent=0):
        """Pretty print tree"""
        prefix = "  " * indent
        if self.is_file:
            print(f"{prefix}📄 {self.name} ({self.size} KB)")
        else:
            print(f"{prefix}📁 {self.name}/")
            for child in self.children:
                child.display(indent + 1)

# Create file system
root = FileNode("Documents")

# Add folders
projects = FileNode("Projects")
photos = FileNode("Photos")

# Add files to Projects
projects.add_child(FileNode("main.py", True, 15))
projects.add_child(FileNode("utils.py", True, 8))
projects.add_child(FileNode("README.md", True, 3))

# Add files to Photos
photos.add_child(FileNode("vacation.jpg", True, 2048))
photos.add_child(FileNode("family.jpg", True, 1536))

# Build hierarchy
root.add_child(projects)
root.add_child(photos)
root.add_child(FileNode("resume.pdf", True, 128))

# Display
root.display()
print(f"\nTotal size: {root.get_total_size()} KB")
```

---

### **Task 2: Social Network Graph** (30 mins)

**Build Instagram-like follower network:**

```python
class SocialNetwork:
    def __init__(self):
        self.users = {}  # {user: [followers]}
        self.following = {}  # {user: [following]}
    
    def add_user(self, username):
        if username not in self.users:
            self.users[username] = []
            self.following[username] = []
    
    def follow(self, follower, following):
        """follower follows following"""
        self.add_user(follower)
        self.add_user(following)
        
        if following not in self.following[follower]:
            self.following[follower].append(following)
            self.users[following].append(follower)
            print(f"✓ {follower} followed {following}")
    
    def get_followers(self, username):
        return self.users.get(username, [])
    
    def get_following(self, username):
        return self.following.get(username, [])
    
    def suggest_friends(self, username):
        """Suggest: friends of friends"""
        suggestions = set()
        
        # Get friends of my friends
        for friend in self.following.get(username, []):
            for friend_of_friend in self.following.get(friend, []):
                # Don't suggest myself or people I already follow
                if (friend_of_friend != username and 
                    friend_of_friend not in self.following.get(username, [])):
                    suggestions.add(friend_of_friend)
        
        return list(suggestions)
    
    def find_mutual_friends(self, user1, user2):
        """Find common people both follow"""
        followers1 = set(self.following.get(user1, []))
        followers2 = set(self.following.get(user2, []))
        return list(followers1 & followers2)  # Intersection

# Test - Indian Influencers Network
network = SocialNetwork()

# Build network
network.follow("Amit", "ViratKohli")
network.follow("Amit", "RohitSharma")
network.follow("Priya", "ViratKohli")
network.follow("Priya", "AnushkaSharma")
network.follow("Rahul", "ViratKohli")
network.follow("Rahul", "RohitSharma")
network.follow("Sneha", "AnushkaSharma")

print(f"\nAmit's followers: {network.get_followers('Amit')}")
print(f"Amit is following: {network.get_following('Amit')}")

print(f"\nViratKohli's followers: {network.get_followers('ViratKohli')}")

print(f"\nSuggestions for Amit: {network.suggest_friends('Amit')}")

print(f"\nMutual follows (Amit & Rahul): {network.find_mutual_friends('Amit', 'Rahul')}")
```

---

### **Task 3: Word Frequency Counter (Hash Map)** (20 mins)

**Count word frequency in text:**

```python
def count_words(text):
    """Count how many times each word appears"""
    # Clean and split
    words = text.lower().replace('.', '').replace(',', '').split()
    
    # Count using hash map
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1
    
    return freq

def top_k_words(freq, k=5):
    """Get top K most frequent words"""
    # Sort by frequency (descending)
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return sorted_words[:k]

# Indian National Anthem (first line)
text = """
Jana gana mana adhinayaka jaya he
Bharata bhagya vidhata
Punjab Sindh Gujarat Maratha
Dravida Utkala Banga
"""

freq = count_words(text)
print("Word Frequency:")
for word, count in freq.items():
    print(f"  {word:15} : {count}")

print(f"\nTop 5 words: {top_k_words(freq, 5)}")
```

**Real Use:** Search engines use this to rank pages!

---

### **Task 4: LRU Cache (Hash + Doubly Linked List)** (30 mins)

**Least Recently Used Cache (used in databases, OS):**

```python
from collections import OrderedDict

class LRUCache:
    """Cache with limited size - removes least recently used when full"""
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        """Get value, mark as recently used"""
        if key not in self.cache:
            return -1
        
        # Move to end (most recent)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        """Add/update value"""
        if key in self.cache:
            # Update and move to end
            self.cache.move_to_end(key)
        
        self.cache[key] = value
        
        # If over capacity, remove oldest
        if len(self.cache) > self.capacity:
            oldest = next(iter(self.cache))
            print(f"  Evicted: {oldest} (LRU)")
            del self.cache[oldest]
    
    def display(self):
        print(f"Cache: {list(self.cache.items())}")

# Test - Website Page Cache
print("=== LRU Cache (capacity=3) ===\n")
cache = LRUCache(3)

cache.put("home.html", "Home Page Content")
cache.put("about.html", "About Page Content")
cache.put("contact.html", "Contact Page Content")
cache.display()

print("\nAccess home.html (moves to recent)")
cache.get("home.html")
cache.display()

print("\nAdd products.html (cache full, evicts least recent)")
cache.put("products.html", "Products Page Content")
cache.display()
```

**Real Use:** Redis, CDN caching, database query cache

---

### **Task 5: Shortest Path in Metro (Dijkstra's Algorithm)** (25 mins)

**Find shortest path in Delhi Metro:**

```python
import heapq

class MetroNetwork:
    def __init__(self):
        self.graph = {}  # {station: [(neighbor, distance_in_km)]}
    
    def add_route(self, station1, station2, distance):
        if station1 not in self.graph:
            self.graph[station1] = []
        if station2 not in self.graph:
            self.graph[station2] = []
        
        self.graph[station1].append((station2, distance))
        self.graph[station2].append((station1, distance))  # Undirected
    
    def shortest_path(self, start, end):
        """Dijkstra's algorithm"""
        # Priority queue: (distance, station)
        pq = [(0, start)]
        distances = {start: 0}
        previous = {}
        
        while pq:
            current_dist, current = heapq.heappop(pq)
            
            if current == end:
                # Reconstruct path
                path = []
                while current in previous:
                    path.append(current)
                    current = previous[current]
                path.append(start)
                return path[::-1], distances[end]
            
            if current_dist > distances.get(current, float('inf')):
                continue
            
            for neighbor, weight in self.graph.get(current, []):
                distance = current_dist + weight
                
                if distance < distances.get(neighbor, float('inf')):
                    distances[neighbor] = distance
                    previous[neighbor] = current
                    heapq.heappush(pq, (distance, neighbor))
        
        return None, None  # No path found

# Delhi Metro Red Line (simplified)
metro = MetroNetwork()
metro.add_route("Rithala", "Rohini West", 2)
metro.add_route("Rohini West", "Rohini East", 1.5)
metro.add_route("Rohini East", "Pitampura", 2.5)
metro.add_route("Pitampura", "Kohat Enclave", 1.8)
metro.add_route("Kohat Enclave", "Netaji Subhash Place", 3.2)
metro.add_route("Netaji Subhash Place", "Kashmere Gate", 4.5)

start = "Rithala"
end = "Kashmere Gate"

path, distance = metro.shortest_path(start, end)
print(f"Shortest path from {start} to {end}:")
print(f"Route: {' → '.join(path)}")
print(f"Total distance: {distance} km")
```

---

## ✅ Verification Checklist

Before declaring Module 2 COMPLETE, ensure you can answer:

- [ ] What's the difference between tree and graph?
- [ ] How does Binary Search Tree maintain order?
- [ ] Why is hash map lookup O(1)?
- [ ] What's the difference between BFS and DFS?
- [ ] When to use tree vs graph?
- [ ] How does LRU cache work?
- [ ] What's a collision in hash map?
- [ ] Give 3 real-world applications of graphs

**Module 2 Complete!** You now understand core programming & data structures! 🎉

---

## 📖 Resources

### **Visualizations:**
- **VisuAlgo:** Tree & graph animations
- **Graph Online:** Draw and explore graphs

### **Practice:**
- **LeetCode:** Tree & graph problems
- **GeeksforGeeks:** Data structures practice

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **FAANG Interviews** | 50% of questions use trees/graphs |
| **Backend Developer**  | Database indexing (B-Trees), caching (hash) |
| **ML Engineer** | Decision trees, neural networks (graphs) |
| **System Design** | Graph databases, distributed hashing |
| **Maps/Navigation** | Shortest path algorithms |

---

## 🚀 Module 2 Complete! 🎉

**Congratulations! You've finished Programming & Data Structures!** 

### **What You've Mastered (Days 6-10):**
✅ Algorithmic Thinking & Big O  
✅ Programming Paradigms (OOP, Functional)  
✅ Object-Oriented Programming Deep Dive  
✅ Linear Data Structures (Array, Stack, Queue, List)  
✅ Non-Linear Data Structures (Tree, Graph, Hash Map)  

### **Before Module 3:**
1. **Push all work to GitHub**
   ```bash
   git add .
   git commit -m "Module 2 COMPLETE! Days 6-10: Programming & DSA"
   git push
   ```

2. **Update Progress Tracker** - 33% done (10/30 days)!

3. **Celebrate & Reflect:**
   - Which data structure was hardest?
   - Which will you use most?
   - Review any confusing topics

4. **Share achievement:**
   ```
   Module 2 COMPLETE! (Days 6-10) ✅
   
   From algorithms to graphs!
   
   Built: Banking system, metro pathfinder, social network
   
   Next: Module 3 - Software Tools (Linux, Git, GitHub) 🛠️
   
   #30DaysOfCode #DataStructures
   ```

5. **Review Module 2** - Complete the checkpoint below!

---

## 🎓 **MODULE 2 COMPLETE - Knowledge Checkpoint**

### **🎉 Congratulations! You've Completed Module 2: Programming & Data Structures!**

### **📚 What You Learned (Days 6-10)**

#### **Day 6: Algorithmic Thinking**
- ✅ Big O notation (O(1), O(n), O(n²), O(log n))
- ✅ Time and space complexity analysis
- ✅ Algorithm optimization techniques
- ✅ Practical complexity comparisons

#### **Day 7: Programming Paradigms**
- ✅ Procedural vs OOP vs Functional programming
- ✅ When to use each paradigm
- ✅ Compiled vs Interpreted languages
- ✅ First-class functions and lambdas

#### **Day 8: Object-Oriented Programming**
- ✅ 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism)
- ✅ Class design and hierarchies
- ✅ SOLID principles basics
- ✅ Design patterns (Singleton, Factory)

#### **Day 9: Linear Data Structures**
- ✅ Arrays, Linked Lists, Stacks, Queues
- ✅ Time complexity of operations
- ✅ When to use each structure
- ✅ IRCTC booking system implementation

#### **Day 10: Non-Linear Data Structures**
- ✅ Trees (Binary Search Trees)
- ✅ Graphs (BFS, DFS, shortest path)
- ✅ Hash Maps (O(1) lookups!)
- ✅ Real-world applications (Metro routing, LRU cache)

---

### **🎯 Module 2 Mastery Check**

**Can you code these from scratch?**
- [ ] Binary Search Tree (insert, search, delete)
- [ ] Stack implementation (push, pop, peek)
- [ ] Queue implementation (enqueue, dequeue)
- [ ] Graph BFS/DFS traversal
- [ ] Hash map collision handling

**Can you explain these?**
- [ ] Why is binary search O(log n)?
- [ ] When to use array vs linked list?
- [ ] Difference between BFS and DFS?
- [ ] How does Instagram use graphs?
- [ ] What is polymorphism with a real example?

---

### **📹 MANDATORY: Record Your Learning (5 minutes)**

**Recording Task:**

Record a **5-minute video/audio** explaining:

1. **Data Structures Comparison (2 min):**
   - Explain when to use: Array, Linked List, Stack, Queue, Tree, Hash Map
   - Give real-world examples for each (e.g., "Stack = browser back button")

2. **Algorithm Complexity (1.5 min):**
   - Explain Big O notation with examples
   - Compare searching in unsorted array vs BST vs Hash Map
   - Draw the complexity graph (constant, log, linear, quadratic)

3. **OOP in Action (1.5 min):**
   - Design a simple e-commerce system using OOP
   - Show: User class, Product class, Order class
   - Demonstrate inheritance (e.g., PrimeUser extends User)

**How to Record:**
```bash
# Create recordings directory
mkdir -p recordings

# Option 1: Whiteboard + Screen record
- Draw data structures on whiteboard/paper
- Screen record while explaining (OBS/Win+G)

# Option 2: Code walkthrough
- Open your best Day 6-10 project
- Record yourself explaining the code

# Option 3: Presentation
- Create 3-5 slides summarizing each day
- Present while recording
```

**Save as:**
```
recordings/
  └── module_2_programming_dsa.mp4  (or .mp3)
```

**Challenge:** Can you explain DSA to someone with zero coding experience?

---

### **🔗 Real-World Connections**

**This module is CRITICAL for:**

| What You Can Build Now | Data Structures Used |
|------------------------|---------------------|
| **Browser Back/Forward** | Stack (history) |
| **Flipkart Shopping Cart** | Hash Map (fast lookup) + Array |
| **Google Maps** | Graph (roads) + Dijkstra's algorithm |
| **YouTube Recommendations** | Graph (user connections) |
| **LinkedIn Connections** | Graph (social network) |
| **Database Indexing** | B-Trees (variant of BST) |
| **LRU Cache (Redis)** | Hash Map + Doubly Linked List |

---

### **📊 Progress Checkpoint**

**✅ Completed:** Days 1-10 (33% of 30-day foundation)  
**⏭️ Next:** Module 3 - Software Engineering Tools (Days 11-15)  
**🎯 Skills:** You can now solve 50%+ of LeetCode Easy problems!  

---

### **💪 Interview Readiness**

**After Module 2, you can answer:**
- ✅ "Implement a stack using arrays"
- ✅ "Find duplicates in an array" (Hash Map!)
- ✅ "Design a parking lot system" (OOP!)
- ✅ "Reverse a linked list"
- ✅ "Detect cycle in a graph"

**Practice:** Solve 5 LeetCode Easy problems before Module 3!

---

### **🎯 Before Starting Module 3**

**Required Actions:**
1. ✅ **Record 5-minute DSA explanation** (see above)
2. ✅ Push all code to GitHub
   ```bash
   git add .
   git commit -m "Module 2 Complete: Programming & DSA"
   git push
   ```
3. ✅ Update `PROGRESS_TRACKER.md` (10/30 days done!)
4. ✅ **Practice:** Solve 3-5 DSA problems on LeetCode/HackerRank

**Optional (Recommended):**
5. Create a visual cheat sheet for all data structures
6. Write a blog: "10 Data Structures Every Developer Must Know"
7. Implement one complex project using OOP + DSA

---

### **⏸️ TAKE A BREAK!**

**You've completed the hardest part!** DSA is the foundation of ALL technical interviews.

- ✅ **Celebrate** - You now have skills companies pay ₹8-15 LPA for!
- ✅ **Review** - Skim through your Days 6-10 code
- ✅ **Practice** - DSA is learned by doing, not just reading

**What's Next:**
- 🔧 Module 3 = Practical tools (Linux, Git, GitHub, VS Code)
- 🎯 60% hands-on (less theory, more doing!)
- 💼 Learn tools used daily by professional developers

---

**"Data structures are like LEGOs. Learn them once, build anything forever!" 🧩**

**Tomorrow:** Day 11 - The Command Line (Linux mastery begins!)

[← Day 9: Linear DS](./Day%2009%20-%20Data%20Structures%20I%20(Linear).md) | [Module 3: Day 11 - Linux →](../Module%203%20-%20Software%20Engineering%20Tools%20(Days%2011-15)/Day%2011%20-%20The%20Command%20Line%20(Linux).md)
