# 📅 Day 23: CI/CD Pipelines - Automate Everything!

**Module:** Cloud & DevOps (Days 21-25)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆

---

## 🎯 Objectives

Master continuous integration and deployment:
- GitHub Actions CI/CD workflows
- Automated testing on every commit
- Automatic deployment to cloud
- Build status badges

**Real-world:** Every professional team uses CI/CD. Push code → Auto-test → Auto-deploy!

---

## 📚 Theory (20 mins)

### **CI/CD Pipeline**

```
Developer → Push Code to GitHub
                ↓
         GitHub Actions Triggered
                ↓
    ┌───────────────────────────┐
    │  1. Run Tests             │
    │  2. Build Docker Image    │
    │  3. Push to Docker Hub    │
    │  4. Deploy to Production  │
    └───────────────────────────┘
                ↓
         ✅ Live on Internet!
```

**Benefits:**
- ✅ Catch bugs before production
- ✅ No manual deployment (save hours!)
- ✅ Consistent process (same every time)
- ✅ Fast iterations (deploy 10x/day possible!)

---

## 💻 Hands-On Tasks (90-100 mins)

### **Task 1: GitHub Actions Workflow** (40 mins)

**Create `.github/workflows/ci-cd.yml`:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest flake8
    
    - name: Lint with flake8
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 . --count --max-line-length=127 --statistics
    
    - name: Run tests
      run: |
        pytest tests/ -v --cov=app

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/flipkart-api:latest
    
    - name: Deploy to Railway
      run: |
        curl -X POST ${{ secrets.RAILWAY_WEBHOOK_URL }}
```

**Add secrets in GitHub:**
1. Go to repo → Settings → Secrets → Actions
2. Add:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `RAILWAY_WEBHOOK_URL`

**Create tests:**
```python
# tests/test_app.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'message' in response.data

def test_health_check(client): response = client.get('/api/health')
    assert response.status_code == 200
```

**Push to trigger:**
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main

# Check Actions tab on GitHub to see pipeline running!
```

---

### **Task 2: Status Badge** (10 mins)

**Add to README.md:**
```markdown
# Flipkart Clone API

![CI/CD](https://github.com/your-username/flipkart-api/workflows/CI-CD%20Pipeline/badge.svg)
![Python](https://img.shields.io/badge/python-3.9-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Production-ready e-commerce API with automated testing and deployment.
```

---

### **Task 3: Complete CI/CD Best Practices** (25 mins)

**Enhanced workflow with environment management:**

```yaml
name: Production CI/CD

on:
  push:
    branches: [ main ]

env:
  IMAGE_NAME: flipkart-api
  
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        cache: 'pip'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov flake8
    
    - name: Run linting
      run: flake8 app/ tests/
    
    - name: Run tests with coverage
      env:
        DATABASE_URL: postgresql://postgres:test@localhost/test_db
      run: |
        pytest tests/ --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ${{ secrets.DOCKER_USERNAME }}/${{ env.IMAGE_NAME }}:latest
          ${{ secrets.DOCKER_USERNAME }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying ${{ github.sha }}"
        # Add deployment script here
```

---

## ✅ Verification

- [ ] Created .github/workflows file
- [ ] Tests run automatically on push
- [ ] Docker image builds and pushes
- [ ] Status badge shows on README
- [ ] Understand CI vs CD

---

## 🚀 Wrap Up

**Tomorrow:** Day 24 - Testing Methodologies

[← Day 22: Docker](./Day%2022%20-%20Containerization%20(Docker).md) | [Day 24: Testing →](./Day%2024%20-%20Testing%20Methodologies.md)
