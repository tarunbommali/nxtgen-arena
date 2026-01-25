# 📅 Day 12: Git Version Control - Time Machine for Code

**Module:** Software Engineering Tools (Days 11-15)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - conceptual & practical)

---

## 🎯 Today's Objectives

By end of today, you will understand:
- Git's internal architecture (blobs, trees, commits)
- Branching and merging strategies
- How to undo mistakes safely
- Collaboration workflows
- Why Git is essential for EVERY developer

**Real-world relevance:** 100% of companies use version control. Git is the industry standard. Cannot get a job without it!

---

## 📚 Theory (45-60 minutes)

### **1. Why Git? The Problem It Solves**

**Without Git:**
```
project_final.py
project_final_FINAL.py
project_final_ACTUAL_FINAL.py
project_final_v2_rajesh_edit.py
project_THIS_IS_THE_ONE.py
```

**With Git:**
```
git log --oneline
abc1234 Add payment feature
def5678 Fix login bug
ghi9012 Initial commit

All versions tracked, with messages, who changed what!
```

---

### **2. Git Architecture - Three Trees**

```
Working Directory → Staging Area → Local Repository → Remote Repository
    (files)          (git add)      (git commit)      (git push)

   index.html     →   index.html  →    Commit #1   →    GitHub
   (modified)         (staged)         (saved)          (shared)
```

**Indian Example - Flipkart Feature Development:**
```bash
# 1. Working Directory (making changes)
vim add_to_cart.py  # Edit file

# 2. Staging Area (select what to commit)
git add add_to_cart.py  # Stage specific file

# 3. Local Repository (save snapshot)
git commit -m "Add to cart functionality"

# 4. Remote Repository (share with team)
git push origin main
```

---

### **3. Git Objects - Under the Hood**

#### **Blob** (File content)
```
echo "Hello World" | git hash-object --stdin
b45ef6fec89518d314f546fd6c3025367b721684

# Git stores file content as blob with SHA-1 hash
```

#### **Tree** (Directory structure)
```
tree .
.
├── index.html
└── style.css

# Git tree object:
040000 tree hash1  subdirectory/
100644 blob hash2  index.html
100644 blob hash3  style.css
```

#### **Commit** (Snapshot)
```
Commit object contains:
- Tree hash (directory snapshot)
- Parent commit hash (previous version)
- Author & committer
- Timestamp
- Commit message
```

**Visual:**
```
Commit A ← Commit B ← Commit C (HEAD)
  │          │          │
  Tree ATree B      Tree C
  │          │          │
Blobs...   Blobs...   Blobs...
```

---

### **4. Branches - Parallel Universes**

```
main:      A ← B ← C
                  ↑
                 HEAD

Create feature branch:

main:      A ← B ← C
                  ↑
feature:           D ← E
                      ↑
                     HEAD

After merge:

main:      A ← B ← C ← F (merge commit)
                  ↑     /
feature:           D ← E
```

**Commands:**
```bash
git branch feature-payment     # Create branch
git checkout feature-payment   # Switch to branch
# Or in one command:
git checkout -b feature-payment

git branch                     # List branches
git branch -d feature-payment  # Delete branch
```

**Indian Startup Workflow:**
```bash
# Main branch (production - Flipkart live site)
main

# Development branch (testing)
development

# Feature branches (new features)
feature/upi-integration
feature/cart-redesign
hotfix/payment-bug
```

---

### **5. Merging Strategies**

#### **Fast-Forward Merge** (simplest)
```
main:      A ← B
                 
feature:        C ← D

After merge:
main:      A ← B ← C ← D
                       ↑
                      HEAD
```

#### **Three-Way Merge** (creates merge commit)
```
main:      A ← B ← C
              ↑
feature:       D ← E

After merge:
main:      A ← B ← C ← F (merge commit)
              ↑     ↑ ↑
                    D ← E
```

#### **Rebase** (linear history)
```
Before:
main:      A ← B ← C
              ↑
feature:       D ← E

After git rebase main:
main:      A ← B ← C
                     ↑
feature:              D' ← E'
```

---

### **6. Essential Git Commands**

```bash
# Setup (one time)
git config --global user.name "Rajesh Kumar"
git config --global user.email "rajesh@example.com"

# Initialize
git init                    # Create new repo
git clone https://...       # Clone existing repo

# Daily workflow
git status                  # Check what changed
git add file.txt            # Stage specific file
git add .                   # Stage all changes
git commit -m "Message"     # Commit with message
git commit -am "Message"    # Add + commit (tracked files only)

# Viewing history
git log                     # Full history
git log --oneline           # Compact view
git log --graph --all       # Visual tree
git diff                    # See unstaged changes
git diff --staged           # See staged changes

# Branching
git branch                  # List branches
git branch feature-name     # Create branch
git checkout branch-name    # Switch branch
git checkout -b new-branch  # Create & switch
git merge feature-name      # Merge branch into current

# Undo operations
git checkout -- file.txt    # Discard changes in working dir
git reset HEAD file.txt     # Unstage file
git reset --soft HEAD~1     # Undo last commit (keep changes)
git reset --hard HEAD~1     # Undo last commit (discard changes!)
git revert commit-hash      # Create new commit that undoes changes

# Remote operations
git remote add origin URL   # Add remote
git push origin main        # Push to remote
git pull origin main        # Fetch + merge from remote
git fetch origin            # Download without merging
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: Git Basics - E-commerce Project** (25 mins)

```bash
# Create project
mkdir flipkart-clone
cd flipkart-clone

# Initialize Git
git init
git status

# Create files
echo "# Flipkart Clone" > README.md
echo "Flask>=2.0" > requirements.txt

cat > app.py << 'EOF'
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to Flipkart Clone!"

if __name__ == '__main__':
    app.run(debug=True)
EOF

# First commit
git add .
git status
git commit -m "Initial commit: Flask app setup"

# View history
git log

# Make changes
echo "SQLAlchemy>=1.4" >> requirements.txt
git diff                     # See what changed
git add requirements.txt
git commit -m "Add SQLAlchemy dependency"

# Create .gitignore
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
.env
venv/
*.log
EOF

git add .gitignore
git commit -m "Add gitignore"

# View beautiful log
git log --oneline --graph --all
```

---

### **Task 2: Branching & Merging** (30 mins)

```bash
# Create feature branch for user authentication
git checkout -b feature/user-auth

# Add authentication code
cat > auth.py << 'EOF'
from flask import session

def login(username, password):
    # Simplified login
    if verify_credentials(username, password):
        session['user'] = username
        return True
    return False

def logout():
    session.pop('user', None)

def verify_credentials(username, password):
    # TODO: Implement actual verification
    return username == "test" and password == "test123"
EOF

git add auth.py
git commit -m "Add user authentication module"

# Update app.py
cat >> app.py << 'EOF'

@app.route('/login')
def login_page():
    return "Login Page"
EOF

git add app.py
git commit -m "Add login route"

# View branch history
git log --oneline

# Switch back to main
git checkout main
ls  # Notice auth.py is not here!

# Merge feature into main
git merge feature/user-auth
git log --oneline --graph --all

# Delete feature branch (optional)
git branch -d feature/user-auth
```

---

### **Task 3: Conflict Resolution** (25 mins)

```bash
# Create two conflicting branches

# Branch 1: UI redesign
git checkout -b redesign-ui
cat > templates.py << 'EOF'
def render_homepage():
    return "<html><body><h1>Modern Design!</h1></body></html>"
EOF

git add templates.py
git commit -m "Redesign homepage UI"

# Switch back to main
git checkout main

# Branch 2: Different UI
git checkout -b new-ui
cat > templates.py << 'EOF'
def render_homepage():
    return "<html><body><h1>Classic Design!</h1></body></html>"
EOF

git add templates.py
git commit -m "New classic UI"

# Go back to main and try merging both
git checkout main
git merge redesign-ui    # This works

git merge new-ui         # CONFLICT!
# Git stops and asks you to resolve

# View conflict
cat templates.py
# Shows:
# <<<<<<< HEAD
# Modern Design!
# =======
# Classic Design!
# >>>>>>> new-ui

# Resolve manually
cat > templates.py << 'EOF'
def render_homepage():
    # Merged: Best of both!
    return "<html><body><h1>Modern & Classic Design!</h1></body></html>"
EOF

git add templates.py
git commit -m "Merge new-ui: Resolved conflict"

git log --oneline --graph --all
```

---

### **Task 4: Undo Mistakes** (20 mins)

```bash
# Scenario 1: Undo uncommitted changes
echo "BAD CODE" >> app.py
git status
git diff
git checkout -- app.py    # Undo changes
cat app.py                # Back to normal!

# Scenario 2: Unstage file
echo "TODO: Add feature" > notes.txt
git add notes.txt
git status                # Staged
git reset HEAD notes.txt  # Unstage
git status                # Untracked again

# Scenario 3: Undo last commit (keep changes)
echo "# Quick fix" >> README.md
git commit -am "Oops, wrong commit message"
git reset --soft HEAD~1   # Undo commit, keep changes staged
git status
git commit -m "Update README with documentation"

# Scenario 4: Completely undo last commit
echo "TERRIBLE CODE" > bad_file.py
git add bad_file.py
git commit -m "Added bad code"
git reset --hard HEAD~1   # POOF! Gone forever
ls bad_file.py            # File doesn't exist anymore

# Scenario 5: Revert a specific commit (safe for shared branches)
echo "Good code version 1" > feature.py
git add feature.py
git commit -m "Add feature v1"

echo "Good code version 2" >> feature.py
git commit -am "Add feature v2"

echo "BAD code" >> feature.py
git commit -am "Broken feature"

# Revert the broken commit
git log --oneline
# Find the hash of "Broken feature" commit
git revert <commit-hash>
# Creates a NEW commit that undoes the bad one
```

---

### **Task 5: Real Team Workflow** (30 mins)

**Simulate Paytm team collaboration:**

```bash
# Setup (Team Lead)
mkdir paytm-backend
cd paytm-backend
git init

# Create initial structure
cat > payment_gateway.py << 'EOF'
class PaymentGateway:
    def __init__(self):
        self.providers = ['UPI', 'Card', 'NetBanking']
    
    def process_payment(self, amount, method):
        if method not in self.providers:
            raise ValueError(f"Unknown payment method: {method}")
        return f"Processing ₹{amount} via {method}"
EOF

git add .
git commit -m "Initial payment gateway structure"

# Rajesh: Add UPI integration
git checkout -b feature/upi-integration
cat >> payment_gateway.py << 'EOF'

class UPIPayment:
    def send_payment(self, upi_id, amount):
        # Integrate with NPCI
        print(f"Sending ₹{amount} to {upi_id}")
        return {"status": "success", "txn_id": "UPI12345"}
EOF

git add .
git commit -m "Add UPI payment integration"

# Priya: Add card payment (parallel development)
git checkout main
git checkout -b feature/card-payment
cat >> payment_gateway.py << 'EOF'

class CardPayment:
    def charge_card(self, card_number, amount):
        # Integrate with payment processor
        print(f"Charging ₹{amount} to card {card_number[-4:]}")
        return {"status": "success", "txn_id": "CARD67890"}
EOF

git add .
git commit -m "Add card payment integration"

# Merge both features (Team Lead)
git checkout main
git merge feature/upi-integration
git merge feature/card-payment
git log --oneline --graph --all

# Add tests (Amit)
git checkout -b feature/tests
cat > test_payments.py << 'EOF'
import unittest
from payment_gateway import UPIPayment, CardPayment

class TestPayments(unittest.TestCase):
    def test_upi_payment(self):
        upi = UPIPayment()
        result = upi.send_payment("user@paytm", 1000)
        self.assertEqual(result['status'], 'success')
    
    def test_card_payment(self):
        card = CardPayment()
        result = card.charge_card("1234567890123456", 500)
        self.assertEqual(result['status'], 'success')

if __name__ == '__main__':
    unittest.main()
EOF

git add .
git commit -m "Add payment tests"
git checkout main
git merge feature/tests

# Final code review
git log --oneline --all --graph --decorate
```

---

## ✅ Verification Checklist

Before moving to Day 13, ensure you can:

- [ ] Initialize a Git repository
- [ ] Stage and commit changes
- [ ] Create and switch between branches
- [ ] Merge branches
- [ ] Resolve merge conflicts
- [ ] Undo mistakes (checkout, reset, revert)
- [ ] View history and diffs
- [ ] Write meaningful commit messages

**Self-Test:** Create a branch, make commits, merge back to main, then undo last commit.

---

## 📖 Resources

### **Interactive Learning:**
- **Learn Git Branching:** [learngitbranching.js.org](https://learngitbranching.js.org/)
- **Git Immersion:** Guided tutorial

### **Documentation:**
- **Pro Git Book:** Free online (chapters 1-3 are essential)
- **Git Cheat Sheet:** GitHub's official guide

---

## 💡 Connection to Future Roles

| Role | Daily Git Usage |
|------|-----------------|
| **All Developers** | 20-50 commits per week |
| **Open Source Contributor** | Pull requests, code reviews |
| **DevOps** | CI/CD pipeline triggered by commits |
| **Tech Lead** | Review code, manage branches |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 12!** 🎉

Tomorrow: **Day 13 - GitHub & Collaboration** (remote repos, pull requests, open source!)

**Practice:** Make at least 5 commits today in your personal projects!

[← Day 11: Linux](./Day%2011%20-%20The%20Command%20Line%20(Linux).md) | [Day 13: GitHub →](./Day%2013%20-%20GitHub%20&%20Collaboration.md)
