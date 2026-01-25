# 📅 Day 15: Package Management - Dependency Heaven

**Module:** Software Engineering Tools (Days 11-15)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - essential skill)

---

## 🎯 Today's Objectives

By end of today, you will:
- Master pip, npm, and other package managers
- Create and manage virtual environments
- Understand dependency management
- Handle version conflicts
- Publish your own package

**Real-world relevance:** Every project uses 10-100+ external libraries. Package management is CRITICAL for team collaboration and deployment.

---

## 📚 Theory (30-45 minutes)

### **1. Why Package Managers?**

**Without Package Manager:**
```
1. Download library ZIP
2. Extract to project folder
3. Add to Python path manually
4. Repeat for each dependency
5. Update manually when new version
6. Share 500MB project folder with team
```

**With Package Manager (pip):**
```bash
pip install requests
# Done! Library installed + all dependencies
#Team shares requirements.txt (2 KB file!)
```

---

### **2. Python Package Ecosystem**

```
PyPI (Python Package Index)
    ↓
   pip (Package Installer)
    ↓
Virtual Environment (venv)
    ↓
Your Project
```

**Indian Context:**
``bash
# Popular Indian packages:
pip install indic-nlp-library    # Indian language processing
pip install aadhaar-py            # Aadhaar SDK
pip install bharatpay             # Indian payment gateway
pip install bhashini              # Govt translation API
```

---

### **3. Virtual Environments - Isolated Bubbles**

**Problem:**
```
Project A needs Flask 2.0
Project B needs Flask 1.1

Installing both → CONFLICT!
```

**Solution: Virtual Environment**
```
System Python 3.9
│
├── ProjectA/
│   └── venv/  (Flask 2.0)
│
└── ProjectB/
    └── venv/  (Flask 1.1)
```

Each project has its own isolated Python environment!

---

### **4. Requirements.txt - Project Dependencies**

```txt
# requirements.txt
Flask==2.0.3
requests>=2.28.0
SQLAlchemy~=1.4.0

# Version specifiers:
==  Exact version
>=  Minimum version
~=  Compatible version (1.4.x)
```

**Generate:**
```bash
pip freeze > requirements.txt
```

**Install:**
```bash
pip install -r requirements.txt
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Virtual Environment Mastery** (20 mins)

**Create Flipkart Project:**

```bash
# Create project folder
mkdir flipkart-backend
cd flipkart-backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Notice prompt changes:
# (venv) C:\Users\Rajesh\flipkart-backend>

# Install packages
pip install Flask SQLAlchemy psycopg2-binary

# Check installed packages
pip list

# Freeze dependencies
pip freeze > requirements.txt

# View requirements
cat requirements.txt
```

**Create Paytm Project (separate environment):**

```bash
cd ..
mkdir paytm-backend
cd paytm-backend

python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install different versions
pip install Flask==1.1.4  # Older version
pip install requests

pip freeze > requirements.txt
```

**Verify isolation:**
``` bash
# In flipkart-backend:
pip list  # Shows Flask 2.0.3

# In paytm-backend:
pip list  # Shows Flask 1.1.4

# Both coexist peacefully!
```

---

### **Task 2: Dependency Management** (25 mins)

**Create comprehensive requirements:**

```bash
cd ~/projects/ecommerce
python -m venv venv
source venv/bin/activate

# Create requirements-dev.txt (development only)
cat > requirements-dev.txt << 'EOF'
# Development dependencies
pytest==7.2.1
black==23.1.0
flake8==6.0.0
mypy==0.991
pytest-cov==4.0.0
ipython==8.10.0
EOF

# Create requirements.txt (production)
cat > requirements.txt << 'EOF'
# Production dependencies
Flask==2.0.3
SQLAlchemy==1.4.46
psycopg2-binary==2.9.5
Flask-JWT-Extended==4.4.4
python-dotenv==0.21.1
gunicorn==20.1.0
redis==4.5.1
celery==5.2.7

# Indian-specific
razorpay==1.3.0
phonepe-sdk==1.0.0
EOF

# Install both
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Or combine:
cat > requirements-all.txt << 'EOF'
-r requirements.txt
-r requirements-dev.txt
EOF

pip install -r requirements-all.txt
```

**Handle version conflicts:**

```bash
# Install specific version
pip install 'requests==2.28.0'

# Upgrade
pip install --upgrade requests

# Downgrade
pip install 'requests==2.27.0'

# Check outdated
pip list --outdated

# Update all (carefully!)
pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U
```

---

### **Task 3: Create Your Own Package** (30 mins)

**Build "Indian Utils" package:**

```bash
mkdir indian-utils
cd indian-utils

# Create package structure
mkdir indianutils
touch indianutils/__init__.py

# Create modules
cat > indianutils/validators.py << 'EOF'
"""Indian-specific validators"""

import re

def validate_pan(pan: str) -> bool:
    """Validate Indian PAN card number"""
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    return bool(re.match(pattern, pan.upper()))

def validate_aadhaar(aadhaar: str) -> bool:
    """Validate Aadhaar number (12 digits)"""
    aadhaar_clean = re.sub(r'\D', '', aadhaar)
    return len(aadhaar_clean) == 12

def validate_gstin(gstin: str) -> bool:
    """Validate GSTIN number"""
    pattern = r'^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$'
    return bool(re.match(pattern, gstin.upper()))

def validate_ifsc(ifsc: str) -> bool:
    """Validate IFSC code"""
    pattern = r'^[A-Z]{4}0[A-Z0-9]{6}$'
    return bool(re.match(pattern, ifsc.upper()))

def validate_mobile(mobile: str) -> bool:
    """Validate Indian mobile number"""
    mobile_clean = re.sub(r'\D', '', mobile)
    return len(mobile_clean) == 10 and mobile_clean[0] in '6789'
EOF

cat > indianutils/formatters.py << 'EOF'
"""Indian number formatters"""

def format_inr(amount: float) -> str:
    """Format amount in Indian numbering system"""
    s = str(int(amount))
    if len(s) <= 3:
        return f"₹{s}"
    
    # Indian system: XX,XX,XXX
    result = s[-3:]
    s = s[:-3]
    
    while s:
        if len(s) <= 2:
            result = s + ',' + result
            break
        else:
            result = s[-2:] + ',' + result
            s = s[:-2]
    
    return f"₹{result}"

def format_phone(phone: str) -> str:
    """Format phone number: +91-98765-43210"""
    phone_clean = re.sub(r'\D', '', phone)
    if len(phone_clean) == 10:
        return f"+91-{phone_clean[:5]}-{phone_clean[5:]}"
    return phone

import re
EOF

cat > indianutils/__init__.py << 'EOF'
"""Indian Utilities - Validators and formatters for Indian data"""

__version__ = "0.1.0"

from .validators import (
    validate_pan,
    validate_aadhaar,
    validate_gstin,
    validate_ifsc,
    validate_mobile
)

from .formatters import (
    format_inr,
    format_phone
)

__all__ = [
    'validate_pan',
    'validate_aadhaar',
    'validate_gstin',
    'validate_ifsc',
    'validate_mobile',
    'format_inr',
    'format_phone',
]
EOF

# Create setup.py
cat > setup.py << 'EOF'
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="indianutils",
    version="0.1.0",
    author="Rajesh Kumar",
    author_email="rajesh@example.com",
    description="Indian validators and formatters",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/rajesh/indianutils",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
)
EOF

# Create README
cat > README.md << 'EOF'
# Indian Utils

Validators and formatters for Indian data formats.

## Installation

```bash
pip install indianutils
```

## Usage

```python
from indianutils import validate_pan, format_inr

# Validate PAN
is_valid = validate_pan("ABCDE1234F")  # True

# Format currency
formatted = format_inr(1234567)  # ₹12,34,567
```

## Features
- PAN validation
- Aadhaar validation
- GSTIN validation
- IFSC validation
- Mobile number validation
- Indian currency formatting
- Phone number formatting
EOF

# Install locally (development mode)
pip install -e .

# Test it!
python << 'PYTHON_EOF'
from indianutils import validate_pan, format_inr, validate_mobile

print("Testing Indian Utils...")
print(f"PAN ABCDE1234F valid? {validate_pan('ABCDE1234F')}")
print(f"PAN INVALID123 valid? {validate_pan('INVALID123')}")
print(f"Mobile 9876543210 valid? {validate_mobile('9876543210')}")
print(f"Mobile 1234567890 valid? {validate_mobile('1234567890')}")
print(f"Amount: {format_inr(1234567.89)}")
print(f"Amount: {format_inr(50000)}")
PYTHON_EOF

# Build distribution
pip install build
python -m build

# This creates:
# dist/indianutils-0.1.0.tar.gz
# dist/indianutils-0.1.0-py3-none-any.whl
```

---

### **Task 4: npm & Node Package Management** (20 mins)

**Frontend package management:**

```bash
# Install Node.js first (nodejs.org)

# Create frontend project
mkdir flipkart-frontend
cd flipkart-frontend

# Initialize npm
npm init -y

# Install packages
npm install react react-dom
npm install --save-dev webpack webpack-cli babel-loader

# View package.json
cat package.json

# Install from package.json
npm install

# Update packages
npm update

# Remove package
npm uninstall react

# Global install
npm install -g http-server

# Run scripts
cat > package.json << 'EOF'
{
  "name": "flipkart-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1"
  }
}
EOF

npm run build
```

---

### **Task 5: Docker for Dependency Consistency** (20 mins)

**Ensure same environment everywhere:**

```dockerfile
# Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/app
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/flipkart
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=flipkart
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Run:**
```bash
docker-compose up
# All dependencies + database ready!
# Same environment on every machine
```

---

## ✅ Verification Checklist

**Module 3 COMPLETE!** Ensure you can:

- [ ] Create and activate virtual environments
- [ ] Install packages with pip/npm
- [ ] Generate and use requirements.txt
- [ ] Handle version conflicts
- [ ] Create simple Python package
- [ ] Understand package.json (npm)
- [ ] Use Docker for reproducibility

**Congratulations! You've completed Module 3: Software Engineering Tools!** 🎉

---

## 📖 Resources

- **PyPI:** [pypi.org](https://pypi.org/)
- **npm:** [npmjs.com](https://www.npmjs.com/)
- **Python Packaging Guide:** [packaging.python.org](https://packaging.python.org/)

---

## 🎉 Module 3 Complete!

### **What You've Mastered (Days 11-15):**
✅ Linux Command Line & Bash Scripting  
✅ Git Version Control  
✅ GitHub Collaboration & Open Source  
✅ IDEs & Professional Debugging  
✅ Package Management & Virtual Environments  

### **Next: Module 4 - Databases & Backend (Days 16-20)**

**Before Module 4:**
1. Push all work to GitHub
2. Update Progress Tracker - **50% done (15/30 days)!**
3 Celebrate! You're halfway through!

4. Share:
   ```
   Module 3 COMPLETE! (Days 11-15) ✅
   
   Mastered: Linux, Git, GitHub, VS Code, Package Management
   Built: Custom Python package, automated deployments
   
   Halfway through the 30-day foundation! 🎉
   
   Next: Databases & APIs! 🗄️
   
   #30DaysOfCode #SoftwareTools
   ```

**Tomorrow:** Day 16 - Database Systems (SQL, NoSQL, when to use what)

---

---

## 🎓 **MODULE 3 COMPLETE - Knowledge Checkpoint**

### **🎉 Congratulations! Module 3: Software Engineering Tools Complete!**

### **📚 What You Learned (Days 11-15)**

#### **Day 11: Linux Command Line**
- ✅ File system navigation (cd, ls, pwd)
- ✅ File permissions (chmod, chown)
- ✅ Pipes & redirection (|, >, >>)
- ✅ Bash scripting for automation

#### **Day 12: Git Version Control**
- ✅ Git architecture (working dir, staging, repo)
- ✅ Branching and merging strategies
- ✅ Conflict resolution
- ✅ Undo operations (reset, revert, checkout)

#### **Day 13: GitHub Collaboration**
- ✅ Fork, clone, pull request workflow
- ✅ Code review process
- ✅ GitHub Actions CI/CD basics
- ✅ Open source contribution

#### **Day 14: IDEs & Debugging**
- ✅ VS Code setup and extensions
- ✅ Debugger (breakpoints, step-through)
- ✅ Keyboard shortcuts mastery
- ✅ Custom code snippets

#### **Day 15: Package Management**
- ✅ Virtual environments (venv)
- ✅ pip & npm package managers
- ✅ requirements.txt management
- ✅ Creating your own package

---

### **📹 MANDATORY: Record Your Learning (5 minutes)**

**Recording Task:**

Record a **5-minute video/audio** explaining:

1. **Professional Workflow Demo (2 min):**
   - Create a new project from scratch
   - Initialize Git repository
   - Create virtual environment
   - Install dependencies
   - Push to GitHub

2. **Debugging in Action (1.5 min):**
   - Show a buggy code snippet
   - Use debugger (not print statements!) to find bug
   - Explain breakpoints, variable inspection, step-through

3. **Command Line Power (1.5 min):**
   - Demonstrate 5 essential Linux commands
   - Show a bash script you created
   - Explain how you'd deploy code to a server

**Save as:** `recordings/module_3_professional_tools.mp4`

---

### **🎯 Module 3 Mastery Check**

- [ ] Can navigate Linux file system without GUI?
- [ ] Created and merged at least 3 Git branches?
- [ ] Made at least 1 open source contribution (even docs)?
- [ ] Can debug code using breakpoints (not print!)?
- [ ] Created a Python package with setup.py?
- [ ] Know 20+ keyboard shortcuts in VS Code?

---

### **📊 Progress Checkpoint**

**✅ Completed:** Days 1-15 (50% of 30-day foundation!)  
**⏭️ Next:** Module 4 - Databases & Backend (Days 16-20)  
**💪 Skills:** You now use tools professional developers use daily!  

---

### **🎯 Before Starting Module 4**

**Required:**
1. ✅ Record 5-minute demo (see above)
2. ✅ Push everything to GitHub with good commit messages
3. ✅ Share your GitHub profile on LinkedIn

**Recommended:**
- Practice Git branching daily this week
- Use only terminal (avoid GUI) for file operations
- Contribute to 2-3 more open source projects

---

### **⏸️ HALFWAY CELEBRATION!**

**You're 50% Done! 🎉** This is a MAJOR milestone!

- ✅ You know what professional developers use
- ✅ Your GitHub shows real commit history
- ✅ You can collaborate on real projects

**Module 4 = Backend Development (Databases & APIs)**  
This is where it all comes together! 🚀

**Tomorrow:** Day 16 - Database Systems (SQL vs NoSQL)

[← Day 14: IDEs & Debugging](./Day%2014%20-%20IDEs%20&%20Debugging.md) | [Module 4: Day 16 - Databases →](../Module%204%20-%20Databases%20&%20Backend%20(Days%2016-20)/Day%2016%20-%20Database%20Systems%20(DBMS).md)
