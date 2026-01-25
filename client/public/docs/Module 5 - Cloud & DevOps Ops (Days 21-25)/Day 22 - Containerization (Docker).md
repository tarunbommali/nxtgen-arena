# 📅 Day 22: Docker - Package Once, Run Anywhere

**Module:** Cloud & DevOps (Days 21-25)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Advanced - game changer!)

---

## 🎯 Today's Objectives

By end of today, you will:
- Understand containers vs virtual machines
- Write Dockerfiles for Python/Node apps
- Use Docker Compose for multi-container apps
- Deploy containerized apps
- Understand why Docker is industry standard

**Real-world relevance:** 90% of companies use Docker. Netflix runs 100,000+ containers! Essential for modern development.

---

## 📚 Theory (30-40 minutes)

### **1. The Problem Docker Solves**

**"It works on my machine!" 😢**
```
Developer machine: Python 3.9, PostgreSQL 13
Production server: Python 3.7, PostgreSQL 12
→ App breaks in production!
```

**Docker Solution:**
```
Package app + Python 3.9 + PostgreSQL 13 → Container
→ Runs identically everywhere (laptop, server, cloud)
```

---

###**2. Containers vs Virtual Machines**

```
VIRTUAL MACHINES:
┌─────────────────────────────────────┐
│         App 1    │    App 2         │
│      Python 3.9  │  Node.js 16      │
├──────────────────┼──────────────────┤
│  Guest OS (Ubuntu) │ Guest OS (Debian)│  ← Lots of duplication
├──────────────────┴──────────────────┤
│         Hypervisor (VMware, VirtualBox)│
├──────────────────────────────────────┤
│         Host OS (Windows/Mac)        │
└──────────────────────────────────────┘

CONTAINERS (Docker):
┌─────────────────────────────────────┐
│   App 1  │  App 2  │  App 3         │
│ + deps   │ + deps  │ + deps         │
├──────────┼─────────┼─────────────────┤
│         Docker Engine               │  ← Shared kernel
├──────────────────────────────────────┤
│         Host OS (Linux)              │
└──────────────────────────────────────┘

Containers = Lightweight (MBs vs GBs)
           + Fast startup (seconds vs minutes)
           + Portable (same everywhere)
```

---

### **3. Docker Core Concepts**

```
Dockerfile  → Image → Container

Dockerfile: Recipe (instructions to build)
Image: Template (read-only snapshot)
Container: Running instance (like a process)
```

---

## 💻 Hands-On Tasks (80-100 minutes)

### **Task 1: Install Docker** (10 mins)

```bash
# Windows/Mac: Download Docker Desktop
# https://www.docker.com/products/docker-desktop

# Linux (Ubuntu):
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER  # Add user to docker group
# Logout and login again

# Verify
docker --version
docker run hello-world  # Test installation
```

---

### **Task 2: Dockerize Flask API** (30 mins)

**Project structure:**
```
flipkart-api/
├── app.py
├── requirements.txt
├── Dockerfile          ← New!
└── .dockerignore       ← New!
```

**Dockerfile:**
```dockerfile
# Start from Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first (Docker layer caching!)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

**.dockerignore:**
```
__pycache__
*.pyc
.env
venv/
.git/
.gitignore
README.md
*.log
```

**Build and run:**
```bash
# Build image
docker build -t flipkart-api:v1 .

# Run container
docker run -d \
  --name flipkart-container \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  flipkart-api:v1

# Test
curl http://localhost:5000

# View logs
docker logs flipkart-container

# Stop
docker stop flipkart-container

# Remove
docker rm flipkart-container
```

**Common Docker commands:**
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# List images
docker images

# Remove image
docker rmi flipkart-api:v1

# Execute command in container
docker exec -it flipkart-container bash

# View container stats
docker stats
```

---

### **Task 3: Docker Compose (Multi-Container)** (35 mins)

**Problem:** App needs PostgreSQL + Redis + Flask

**Solution: docker-compose.yml**
```yaml
version: '3.8'

services:
  # Flask API
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/flipkart
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
    command: gunicorn --bind 0.0.0.0:5000 --reload app:app

  # PostgreSQL Database
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=flipkart
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**Run entire stack:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Run command in service
docker-compose exec web python manage.py migrate
```

**Updated app.py (with Redis caching):**
```python
from flask import Flask, jsonify
import os
import psycopg2
import redis

app = Flask(__name__)

# Connect to Redis
redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))

# Connect to PostgreSQL
def get_db():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

@app.route('/')
def home():
    # Try cache first
    cached = redis_client.get('homepage_data')
    if cached:
        return jsonify({'message': 'From Redis Cache!', 'data': cached.decode()})
    
    # Cache miss - fetch from database
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT version()")
    db_version = cur.fetchone()[0]
    cur.close()
    conn.close()
    
    # Store in cache (5 minutes)
    redis_client.setex('homepage_data', 300, db_version)
    
    return jsonify({'message': 'From Database!', 'data': db_version})

@app.route('/health')
def health():
    try:
        # Check database
        conn = get_db()
        conn.close()
        
        # Check Redis
        redis_client.ping()
        
        return jsonify({'status': 'healthy'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

### **Task 4: Production Dockerfile (Multi-stage Build)** (20 mins)

**Optimize image size:**

```dockerfile
# Multi-stage build for smaller images
FROM python:3.9-slim AS builder

WORKDIR /app

# Install dependencies in builder stage
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Final stage - smaller image
FROM python:3.9-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

**Compare sizes:**
```bash
# Build regular
docker build -t flipkart-api:regular -f Dockerfile.regular .

# Build multi-stage
docker build -t flipkart-api:optimized -f Dockerfile .

# Compare
docker images | grep flipkart-api
# optimized: ~150MB
# regular: ~350MB
```

---

### **Task 5: Deploy to Docker Hub** (15 mins)

```bash
# 1. Create account on hub.docker.com

# 2. Login
docker login

# 3. Tag image
docker tag flipkart-api:v1 your-username/flipkart-api:v1

# 4. Push to Docker Hub
docker push your-username/flipkart-api:v1

# Now anyone can pull your image:
docker pull your-username/flipkart-api:v1
docker run -p 5000:5000 your-username/flipkart-api:v1
```

---

### **Task 6: Real-World Example - Complete Stack** (20 mins)

**Full E-commerce Stack:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

  # Flask API (3 replicas for load balancing)
  web:
    build: .
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/flipkart
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    deploy:
      replicas: 3  # Run 3 instances
    
  # PostgreSQL
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: flipkart
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine

  # Adminer (Database UI)
  adminer:
    image: adminer
    ports:
      - "8080:8080"

volumes:
  postgres_data:
```

**nginx.conf (Load Balancer):**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream flask {
        server web:5000;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://flask;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**Run:**
```bash
docker-compose up --scale web=3
# Visit: http://localhost (nginx balances across 3 Flask instances!)
```

---

## ✅ Verification Checklist

Before Day 23:

- [ ] Installed Docker Desktop/Engine
- [ ] Created Dockerfile for your app
- [ ] Built and ran Docker container
- [ ] Used Docker Compose for multi-container setup
- [ ] Pushed image to Docker Hub
- [ ] Understand multi-stage builds

---

## 📖 Resources

- **Docker Docs:** [docs.docker.com](https://docs.docker.com/)
- **Play with Docker:** [labs.play-with-docker.com](https://labs.play-with-docker.com/) (Free online Docker)
- **Docker Hub:** [hub.docker.com](https://hub.docker.com/)

---

## 💡 Connection to Future Roles

| Role | Docker Usage |
|------|--------------|
| **DevOps Engineer** | 100% - container orchestration daily |
| **Backend Developer** | Dockerize all services |
| **Full Stack** | Local development with Docker Compose |
| **Cloud Architect** | Kubernetes (container orchestration) |

**Docker + Kubernetes = ₹12-20 LPA DevOps roles!**

---

## 🚀 Wrap Up

**Tomorrow:** Day 23 - CI/CD Pipelines (Automate EVERYTHING!)

[← Day 21: Cloud](./Day%2021%20-%20Virtualization%20&%20Cloud.md) | [Day 23: CI/CD →](./Day%2023%20-%20CI-CD%20Pipeline.md)
