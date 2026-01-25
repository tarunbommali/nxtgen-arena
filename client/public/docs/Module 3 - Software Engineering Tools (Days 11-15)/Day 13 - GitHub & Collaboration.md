# 📅 Day 13: GitHub & Collaboration - Social Coding Platform

**Module:** Software Engineering Tools (Days 11-15)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - practical skills)

---

## 🎯 Today's Objectives

By end of today, you will:
- Master GitHub workflows (clone, fork, pull request)
- Contribute to open source projects
- Build your developer portfolio
- Collaborate with teams effectively
- Understand code review process

**Real-world relevance:** GitHub is your developer resume. Recruiters check your profile before interviews. Open source contributions = job offers!

---

## 📚 Theory (30-45 minutes)

### **1. GitHub vs Git**

```
Git:     Version control system (local)
GitHub:  Cloud platform for Git repos (+ social features)

Alternatives: GitLab, Bitbucket, Gitea
```

**Why GitHub?**
- ✅ 100+ million developers
- ✅ Most open source projects
- ✅ Free hosting
- ✅ CI/CD (GitHub Actions)
- ✅ Your public portfolio

---

### **2. GitHub Workflow**

```
Your Computer          GitHub (Cloud)          Teammate's Computer
     │                      │                         │
     │─── git push ────────►│                         │
     │                      │                         │
     │◄─── git pull ────────│◄──── git push ──────────│
     │                      │                         │
     │                   Fork/PR                      │
     │                      │                         │
```

**Core Actions:**
1. **Clone:** Copy repo to your computer
2. **Fork:** Copy someone else's repo to your account
3. **Pull Request (PR):** Propose changes to original repo
4. **Issues:** Track bugs/features
5. **Actions:** Automate workflows

---

### **3. Personal vs Organization Repos**

**Personal Repository:**
```
https://github.com/rajesh-kumar/paytm-clone
                   │
                   Your username
```

**Organization Repository:**
```
https://github.com/flipkart/ecommerce-platform
                   │
                   Company/Organization
```

**Visibility:**
- **Public:** Anyone can see (open source)
- **Private:** Only invited collaborators (company code)

---

### **4. Pull Request Workflow (Open Source Contribution)**

```
1. Fork original repo to your account
   flipkart/app → rajesh/app

2. Clone YOUR fork to computer
   git clone https://github.com/rajesh/app.git

3. Create feature branch
   git checkout -b fix-payment-bug

4. Make changes & commit
   git commit -m "Fix UPI timeout issue"

5. Push to YOUR fork
   git push origin fix-payment-bug

6. Create Pull Request on GitHub
   rajesh/app → flipkart/app

7. Code review & discussion

8. Merge (by maintainer)
```

---

### **5. README.md - Your Project's Face**

**Good README includes:**
```markdown
# Project Name

## Description
Brief explanation of what project does

## Installation
```bash
pip install -r requirements.txt
```

## Usage
```python
from myproject import main
main()
```

## Features
- Feature 1
- Feature 2

## Contributing
Guidelines for contributors

## License
MIT License

## Contact
- Email: dev@example.com
- LinkedIn: linkedin.com/in/rajesh
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Setup GitHub Profile** (20 mins)

**If not already done:**
1. Create account: [github.com](https://github.com)
2. Choose username carefully (professional! e.g., rajesh-kumar-dev)

**Profile README (special repo):**
```bash
# Create repo named exactly as your username
# Example: If username is "rajesh-kumar", create repo "rajesh-kumar"

mkdir rajesh-kumar
cd rajesh-kumar

cat > README.md << 'EOF'
# Hi, I'm Rajesh Kumar 👋

## About Me
🎓 B.Tech Computer Science Student  
💻 Aspiring Backend Developer  
🌏 Based in Delhi, India  
🚀 Currently learning: Cloud Computing & DevOps  

## Skills
**Languages:** Python, Java, JavaScript  
**Frameworks:** Flask, Django, React  
**Tools:** Git, Docker, Linux  
**Databases:** PostgreSQL, MongoDB  

## Projects
- 🛒 [E-commerce Clone](https://github.com/rajesh/ecommerce) - Full-stack shopping platform
- 💳 [UPI Payment Gateway](https://github.com/rajesh/upi-gateway) - Payment integration
- 📊 [Data Analytics Dashboard](https://github.com/rajesh/analytics) - Real-time insights

## GitHub Stats
![Rajesh's GitHub stats](https://github-readme-stats.vercel.app/api?username=rajesh-kumar&show_icons=true&theme=radical)

## Connect
[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue)](https://linkedin.com/in/rajesh-kumar)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2)](https://twitter.com/rajesh_dev)
[![Email](https://img.shields.io/badge/Email-D14836)](mailto:rajesh@example.com)

---
⭐️ From [rajesh-kumar](https://github.com/rajesh-kumar)
EOF

git init
git add README.md
git commit -m "Add profile README"

# Create repo on GitHub (website), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.git
git push -u origin main
```

---

### **Task 2: Create Project Repository** (25 mins)

**Build a Flipkart Clone repo with good documentation:**

```bash
mkdir flipkart-clone
cd flipkart-clone

# Create comprehensive README
cat > README.md << 'EOF'
# 🛒 Flipkart Clone - E-commerce Platform

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📝 Description
A full-featured e-commerce platform inspired by Flipkart, built with Flask and PostgreSQL. Includes user authentication, product catalog, cart management, and payment integration.

## ✨ Features
- ✅ User Registration & Login (JWT Auth)
- ✅ Product Search & Filters
- ✅ Shopping Cart
- ✅ UPI/Card Payment Integration
- ✅ Order Tracking
- ✅ Admin Dashboard

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 13+
- Redis (for caching)

### Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/flipkart-clone.git
cd flipkart-clone

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb flipkart_db
python migrate.py

# Run server
python app.py
```

Visit: `http://localhost:5000`

## 📸 Screenshots
![Homepage](screenshots/home.png)
![Product Page](screenshots/product.png)

## 🛠️ Tech Stack
- **Backend:** Flask, SQLAlchemy
- **Database:** PostgreSQL
- **Cache:** Redis
- **Frontend:** Jinja2, Bootstrap 5
- **Payment:** Razorpay API

## 📁 Project Structure
```
flipkart-clone/
├── app.py              # Main application
├── models.py           # Database models
├── routes/
│   ├── auth.py         # Authentication routes
│   ├── products.py     # Product routes
│   └── orders.py       # Order routes
├── templates/          # HTML templates
├── static/            # CSS, JS, images
├── tests/             # Unit tests
└── requirements.txt   # Dependencies
```

## 🧪 Testing
```bash
pytest tests/
```

## 🤝 Contributing
Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License
This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 📧 Contact
Rajesh Kumar - [@rajesh_dev](https://twitter.com/rajesh_dev) - rajesh@example.com

Project Link: [https://github.com/rajesh-kumar/flipkart-clone](https://github.com/rajesh-kumar/flipkart-clone)

## 🙏 Acknowledgments
- Flipkart for inspiration
- Flask documentation
- Bootstrap team

---
⭐ Star this repo if you find it helpful!
EOF

# Create other files
cat > requirements.txt << 'EOF'
Flask==2.0.3
SQLAlchemy==1.4.46
psycopg2-binary==2.9.5
Flask-JWT-Extended==4.4.4
redis==4.5.1
pytest==7.2.1
EOF

cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Rajesh Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy...
EOF

cat > CONTRIBUTING.md << 'EOF'
# Contributing to Flipkart Clone

## How to Contribute
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Code Style
- Follow PEP 8 for Python code
- Use meaningful variable names
- Add docstrings to functions

## Reporting Bugs
Open an issue with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
ENV/

# IDE
.vscode/
.idea/
*.swp

# Environment
.env
.env.local

# Database
*.db
*.sqlite3

# Logs
*.log
EOF

mkdir -p {templates,static,tests,routes}
touch app.py models.py routes/{auth,products,orders}.py

# Initialize git and push
git init
git add .
git commit -m "Initial commit: Project structure and documentation"

# Create repo on GitHub website, then:
# git remote add origin https://github.com/YOUR_USERNAME/flipkart-clone.git
# git push -u origin main
```

---

### **Task 3: Fork & Contribute to Open Source** (30 mins)

**Real open source contribution:**

1. **Find beginner-friendly project:**
   - Visit: [github.com/topics/good-first-issue](https://github.com/topics/good-first-issue)
   - Or: [firstcontributions.github.io](https://firstcontributions.github.io/)

2. **Fork a project:**
   - Click "Fork" button on GitHub
   - Now you have copy in your account

3. **Clone YOUR fork:**
```bash
git clone https://github.com/YOUR_USERNAME/project-name.git
cd project-name
```

4. **Add upstream (original repo):**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/project-name.git
git remote -v  # View remotes
```

5. **Create feature branch:**
```bash
git checkout -b fix-typo-in-readme
```

6. **Make changes:**
```bash
# Fix a typo or add documentation
vim README.md
git add README.md
git commit -m "docs: Fix typo in installation instructions"
```

7. **Push to YOUR fork:**
```bash
git push origin fix-typo-in-readme
```

8. **Create Pull Request on GitHub:**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Write clear description:
   ```
   ## Description
   Fixed typo in installation section of README

   ## Changes
   - Changed "instalation" to "installation"

   ## Type of Change
   - [x] Documentation update
   - [ ] Bug fix
   - [ ] New feature
   ```

9. **Respond to code review:**
   - Address feedback
   - Make additional commits if needed
   - Wait for merge!

---

### **Task 4: Team Collaboration Simulation** (25 mins)

**Simulate 3-person team working on Paytm clone:**

```bash
# Setup main repo (Person 1 - Team Lead)
mkdir paytm-team-project
cd paytm-team-project
git init

cat > README.md << 'EOF'
# Paytm Clone - Team Project

## Team Members
- Rajesh (Lead) - Backend
- Priya - Frontend
- Amit - DevOps
EOF

cat > backend.py << 'EOF'
class PaymentService:
    def process_payment(self, amount):
        pass
EOF

git add .
git commit -m "Initial project setup"

# Create repo on GitHub and push
# (Assume repo URL: https://github.com/team/paytm-clone.git)

# Add collaborators via GitHub:
# Settings → Collaborators → Add: priya, amit

# Person 2 (Priya) - Clone and contribute
git clone https://github.com/team/paytm-clone.git paytm-priya
cd paytm-priya
git checkout -b frontend/homepage

cat > frontend.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Paytm Clone</title></head>
<body>
    <h1>Welcome to Paytm</h1>
    <button>Send Money</button>
</body>
</html>
EOF

git add frontend.html
git commit -m "Add homepage UI"
git push origin frontend/homepage
# Open PR on GitHub

# Person 3 (Amit) - Parallel development
git clone https://github.com/team/paytm-clone.git paytm-amit
cd paytm-amit
git checkout -b devops/docker

cat > Dockerfile << 'EOF'
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "backend.py"]
EOF

git add Dockerfile
git commit -m "Add Dockerfile for containerization"
git push origin devops/docker
# Open PR on GitHub

# Person 1 (Rajesh) - Review and merge
cd paytm-team-project
git fetch origin
git checkout frontend/homepage
# Review code on GitHub
# Click "Merge Pull Request"

git checkout main
git pull origin main
# Now has Priya's changes!

# Merge Amit's PR too
# Everyone sync:
git pull origin main
```

---

### **Task 5: GitHub Actions CI/CD** (20 mins)

**Auto-run tests on every commit:**

```bash
cd flipkart-clone

# Create GitHub Actions workflow
mkdir -p .github/workflows

cat > .github/workflows/tests.yml << 'EOF'
name: Run Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest
    
    - name: Run tests
      run: |
        pytest tests/ -v
    
    - name: Lint code
      run: |
        pip install flake8
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
EOF

# Create sample test
mkdir -p tests
cat > tests/test_basic.py << 'EOF'
def test_addition():
    assert 1 + 1 == 2

def test_string():
    assert "Flipkart".lower() == "flipkart"
EOF

git add .
git commit -m "Add GitHub Actions CI/CD"
git push origin main

# Check Actions tab on GitHub - tests run automatically!
```

---

## ✅ Verification Checklist

Before moving to Day 14:

- [ ] Created GitHub account with professional profile
- [ ] Published at least 1 repository with good README
- [ ] Forked an open source project
- [ ] Created a pull request (even if just documentation)
- [ ] Added .gitignore and LICENSE to projects
- [ ] Understood PR review process
- [ ] Setup GitHub Actions for a project

**Self-Test:** Contribute to 3 different open source projects this week!

---

## 📖 Resources

- **GitHub Skills:** [skills.github.com](https://skills.github.com/)
- **First Contributions:** Practice PR workflow
- **Awesome First PR:** Beginner-friendly projects

---

## 💡 Indian Open Source Projects to Contribute

- **CoWIN Vaccine Slot Finder**
- **Aadhaar SDK Projects**
- **Indian Language Processing Tools**
- **Government API Wrappers**

Search GitHub: `language:Python location:India good-first-issue`

---

## 🚀 Wrap Up

**Congratulations on completing Day 13!** 🎉

**Homework:** Make 1-2 open source contributions this week!

Tomorrow: **Day 14 - IDEs & Debugging** (VS Code mastery!)

[← Day 12: Git](./Day%2012%20-%20Version%20Control%20(Git%20Internals).md) | [Day 14: IDEs & Debugging →](./Day%2014%20-%20IDEs%20&%20Debugging.md)
