# 📅 Day 14: IDEs & Debugging - Your Coding Superpower

**Module:** Software Engineering Tools (Days 11-15)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - practical skills)

---

## 🎯 Today's Objectives

By end of today, you will:
- Master VS Code (industry standard IDE)
- Use debugger instead of `print()` statements
- Leverage code completion, snippets, and extensions
- Debug Python, JavaScript, and web applications
- Boost productivity 10x with keyboard shortcuts

**Real-world relevance:** Professional developers spend 8+ hours/day in IDE. Mastering it = 2-3x productivity gain!

---

## 📚 Theory (30-45 minutes)

### **1. IDE vs Text Editor vs Terminal**

| Tool | Features | Use Case | Example |
|------|----------|----------|---------|
| **Text Editor** | Basic editing | Quick edits | Notepad, Nano |
| **Code Editor** | Syntax highlight, plugins | Scripting | VS Code, Sublime |
| **IDE** | Debugger, refactoring, IntelliSense | Full development | PyCharm, VS Code |
| **Terminal Editor** |Command line | Server editing | Vim, Emacs |

**VS Code = Code Editor +Extensions → Full IDE!**

---

### **2. VS Code Essential Features**

#### **IntelliSense (Auto-completion)**
```python
# Type "req" and it suggests:
requests.get()
requests.post()

# Auto-imports missing libraries
import requests  # Auto-added!
```

#### **Multi-cursor Editing**
```
Rajesh Kumar
Priya Sharma
Amit Patel

# Select all "Kumar/Sharma/Patel" → Ctrl+D (multiple times)
# Type once, edits all!
```

#### **Integrated Terminal**
```
Run code without leaving IDE:
Ctrl+` (backtick) → Opens terminal
python app.py
```

---

### **3. Debugging vs Print Statements**

**❌ Print Debugging (Beginner way):**
```python
def calculate_bill(items):
    print(f"items = {items}")  # Debug print
    total = 0
    for item in items:
        print(f"Adding {item['price']}")  # More prints
        total += item['price']
    print(f"Total = {total}")  # Even more prints
    return total
```

**✅ Real Debugging (Professional way):**
```python
def calculate_bill(items):
    total = 0  # Set breakpoint here →
    for item in items:
        total += item['price']  # Step through, inspect variables
    return total

# Run with debugger:
# - Pause at breakpoint
# - Inspect 'items', 'total' values
# - Step through line-by-line
# - No need to modify code!
```

---

### **4. Breakpoints & Debugging Workflow**

```
1. Set Breakpoint (click left of line number)
   → Red dot appears

2. Run in Debug Mode (F5)
   → Code pauses at breakpoint

3. Inspect Variables
   → See all values in "Variables" panel

4. Step Through Code
   - Step Over (F10): Execute current line, move to next
   - Step Into (F11): Enter function calls
   - Step Out (Shift+F11): Exit current function
   - Continue (F5): Run until next breakpoint

5. Debug Console
   → Type expressions to evaluate
   → Example: `total * 1.18` (calculate with GST)
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: VS Code Setup & Extensions** (20 mins)

**Must-Have Extensions:**

1. **Python** (Microsoft)
2. **Pylance** (IntelliSense)
3. **GitLens** (Git superpowers)
4. **Live Server** (Web development)
5. **Prettier** (Code formatter)
6. **Error Lens** (Inline errors)
7. **Auto Rename Tag** (HTML/XML)
8. **Path IntelliSense** (File paths)

**Install:**
```
Ctrl+Shift+X → Search → Install
```

**Settings (Ctrl+,):**
```json
{
    "editor.fontSize": 14,
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "files.autoSave": "afterDelay",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true,
    "editor.minimap.enabled": true,
    "workbench.colorTheme": "Dark+ (default dark)"
}
```

---

### **Task 2: Debugging Python Application** (30 mins)

**Create buggy Flipkart cart:**

```python
# flipkart_cart.py

class Product:
    def __init__(self, name, price, discount=0):
        self.name = name
        self.price = price
        self.discount = discount
    
    def get_final_price(self):
        # BUG: Wrong formula!
        return self.price - self.discount

class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, product, quantity):
        self.items.append({
            'product': product,
            'quantity': quantity
        })
    
    def calculate_total(self):
        total = 0
        for item in self.items:
            # BUG: Not multiplying by quantity!
            price = item['product'].get_final_price()
            total += price
        return total
    
    def apply_gst(self, total):
        # BUG: Wrong GST rate!
        gst_rate = 0.28  # Should be 0.18 for most items
        return total * (1 + gst_rate)

# Test
cart = ShoppingCart()

phone = Product("iPhone 15", 80000, 5000)
case = Product("Phone Case", 500, 50)

cart.add_item(phone, 1)
cart.add_item(case, 2)  # Buying 2 cases

subtotal = cart.calculate_total()
final = cart.apply_gst(subtotal)

print(f"Subtotal: ₹{subtotal}")
print(f"With GST: ₹{final}")
```

**Debug Steps:**

1. **Set breakpoints:**
   - Line: `price = item['product'].get_final_price()`
   - Line: `return self.price - self.discount`

2. **Run debugger (F5)**
   - Select "Python File"

3. **Inspect variables:**
   - Hover over `item['quantity']` → See it's not being used!
   - Check `discount` value

4. **Fix bugs:**
```python
def get_final_price(self):
    # FIX: Discount is percentage, not absolute
    return self.price * (1 - self.discount/100)

def calculate_total(self):
    total = 0
    for item in self.items:
        price = item['product'].get_final_price()
        total += price * item['quantity']  # FIX: Multiply by quantity
    return total

def apply_gst(self, total):
    gst_rate = 0.18  # FIX: Correct rate
    return total * (1 + gst_rate)
```

---

### **Task 3: Debug Web Application** (25 mins)

Create **Flask app with bugs**:

```python
# app.py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory database
users = {
    "rajesh@example.com": {"password": "pass123", "balance": 5000},
    "priya@example.com": {"password": "test456", "balance": 3000}
}

@app.route('/')
def home():
    return "Paytm Clone API"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # BUG 1: No error handling!
    user = users[email]
    
    # BUG 2: Plain text password comparison!
    if user['password'] == password:
        return jsonify({"status": "success", "balance": user['balance']})
    
    return jsonify({"status": "failed"}), 401

@app.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()
    from_email = data['from']
    to_email = data['to']
    amount = int(data['amount'])
    
    # BUG 3: No balance check!
    users[from_email]['balance'] -= amount
    users[to_email]['balance'] += amount
    
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
```

**Debug with launch.json:**

Create `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "request": "launch",
            "module": "flask",
            "env": {
                "FLASK_APP": "app.py",
                "FLASK_ENV": "development"
            },
            "args": [
                "run",
                "--no-debugger",
                "--no-reload"
            ],
            "jinja": true
        }
    ]
}
```

**Test with breakpoints:**
```bash
# In another terminal:
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "rajesh@example.com", "password": "pass123"}'

# Try non-existent user (will crash):
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "amit@example.com", "password": "test"}'
```

**FIX:**
```python
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # FIX: Handle missing user
    if email not in users:
        return jsonify({"status": "failed", "error": "User not found"}), 404
    
    user = users[email]
    
    # FIX: Hash passwords (in production)
    import hashlib
    # hashed = hashlib.sha256(password.encode()).hexdigest()
    
    if user['password'] == password:
        return jsonify({"status": "success", "balance": user['balance']})
    
    return jsonify({"status": "failed", "error": "Invalid password"}), 401

@app.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()
    from_email = data['from']
    to_email = data['to']
    amount = int(data['amount'])
    
    # FIX: Validate balance
    if users[from_email]['balance'] < amount:
        return jsonify({"status": "failed", "error": "Insufficient balance"}), 400
    
    # FIX: Atomic transaction (simplified)
    users[from_email]['balance'] -= amount
    users[to_email]['balance'] += amount
    
    return jsonify({"status": "success", 
                    "new_balance": users[from_email]['balance']})
```

---

### **Task 4: Master Keyboard Shortcuts** (15 mins)

**Practice these 20 times each:**

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| **Command Palette** | Ctrl+Shift+P | Cmd+Shift+P |
| **Quick Open File** | Ctrl+P | Cmd+P |
| **Find in Files** | Ctrl+Shift+F | Cmd+Shift+F |
| **Toggle Terminal** | Ctrl+` | Cmd+` |
| **Multi-Cursor** | Ctrl+D | Cmd+D |
| **Go to Line** | Ctrl+G | Cmd+G |
| **Format Document** | Shift+Alt+F | Shift+Option+F |
| **Toggle Comment** | Ctrl+/ | Cmd+/ |
| **Duplicate Line** | Shift+Alt+Down | Shift+Option+Down |
| **Delete Line** | Ctrl+Shift+K | Cmd+Shift+K |
| **Move Line Up/Down** | Alt+Up/Down | Option+Up/Down |
| **Select All Occurrences** | Ctrl+Shift+L | Cmd+Shift+L |
| **Fold/Unfold Code** | Ctrl+Shift+[ / ] | Cmd+Option+[ / ] |
| **Zen Mode** | Ctrl+K Z | Cmd+K Z |

**Challenge:** Refactor code WITHOUT using mouse!

---

### **Task 5: Code Snippets & Productivity** (20 mins)

**Create custom snippets:**

File → Preferences → User Snippets → python.json

```json
{
    "Flask Route": {
        "prefix": "flaskroute",
        "body": [
            "@app.route('/${1:path}', methods=['${2:GET}'])",
            "def ${3:function_name}():",
            "    ${4:pass}",
            "    return ${5:'response'}"
        ],
        "description": "Flask route template"
    },
    
    "Python Class": {
        "prefix": "pyclass",
        "body": [
            "class ${1:ClassName}:",
            "    def __init__(self, ${2:args}):",
            "        ${3:pass}",
            "    ",
            "    def ${4:method_name}(self):",
            "        ${5:pass}"
        ],
        "description": "Python class template"
    },
    
    "UPI Payment": {
        "prefix": "upipay",
        "body": [
            "def process_upi_payment(upi_id: str, amount: float) -> dict:",
            "    \"\"\"Process UPI payment via NPCI\"\"\"",
            "    # Validate UPI ID",
            "    if not validate_upi(upi_id):",
            "        return {'status': 'failed', 'error': 'Invalid UPI ID'}",
            "    ",
            "    # Process payment",
            "    txn_id = generate_transaction_id()",
            "    # Call NPCI API",
            "    ",
            "    return {",
            "        'status': 'success',",
            "        'txn_id': txn_id,",
            "        'amount': amount",
            "    }"
        ]
    }
}
```

**Use:** Type `upipay` + Tab → Full function appears!

---

## ✅ Verification Checklist

Before moving to Day 15:

- [ ] Installed VS Code with essential extensions
- [ ] Used debugger to fix at least 3 bugs
- [ ] Mastered 10+ keyboard shortcuts
- [ ] Created custom code snippets
- [ ] Debugged Flask/Django application
- [ ] Can set breakpoints & inspect variables
- [ ] Understand Step Over vs Step Into

**Module 3 almost complete!** Just one more day!

---

## 📖 Resources

- **VS Code Docs:** [code.visualstudio.com/docs](https://code.visualstudio.com/docs)
- **Keyboard Shortcuts PDF:** Official cheat sheet
- **VS Code Can Do That:** YouTube series

---

## 🚀 Wrap Up

**Tomorrow:** **Day 15 - Package Management** (pip, npm, virtual environments) - Final day of Module 3!

[← Day 13: GitHub](./Day%2013%20-%20GitHub%20&%20Collaboration.md) | [Day 15: Package Management →](./Day%2015%20-%20Package%20Management.md)
