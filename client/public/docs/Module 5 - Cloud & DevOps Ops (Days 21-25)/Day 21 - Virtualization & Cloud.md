# 📅 Day 21: Cloud Computing & Virtualization - Deploy to the World

**Module:** Cloud & DevOps (Days 21-25)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Challenging - new paradigm)

---

## 🎯 Today's Objectives

By end of today, you will:
- Understand cloud computing (IaaS, PaaS, SaaS)
- Deploy your first app to the cloud (free tier!)
- Understand AWS/Azure/GCP basics
- Know when to use cloud vs own servers
- Configure environment variables securely

**Real-world relevance:** 95% of new apps deploy to cloud. Flipkart uses AWS, Ola uses Azure, Grofers uses GCP. Cloud is THE standard!

---

## 📚 Theory (30-45 minutes)

### **1. What is Cloud Computing?**

**Before Cloud (Traditional):**
```
Buy server (₹2 lakhs) → Install in office → Hire admin → Pay electricity
If traffic increases → Buy MORE servers (months of waiting!)
If traffic decreases → Servers sit idle (wasted money)
```

**With Cloud:**
```
Rent server online (₹500/month) → Scale up in minutes → Pay only for what you use
```

**Benefits:**
- ✅ No upfront hardware cost
- ✅ Scale instantly (handle Flipkart sale traffic!)
- ✅ Pay-as-you-go
- ✅ Global reach (deploy in Mumbai, USA, Singapore)
- ✅ Managed services (database, caching ready to use)

---

### **2. Cloud Service Models**

```
┌────────────────────────────────────────┐
│  SaaS (Software as a Service)          │  You use the app
│  Gmail, Dropbox, Salesforce            │  (No coding needed)
├────────────────────────────────────────┤
│  PaaS (Platform as a Service)          │  You write code
│  Heroku, Railway, Vercel               │  (Platform handles server)
├────────────────────────────────────────┤
│  IaaS (Infrastructure as a Service)    │  You manage server
│  AWS EC2, Azure VMs, GCP Compute       │  (Full control)
└────────────────────────────────────────┘
```

**Example - Deploying Flask App:**
- **IaaS (AWS EC2):** You setup Linux, install Python, configure nginx, manage updates
- **PaaS (Heroku):** Just push code, platform handles everything
- **SaaS:** N/A (you're building the SaaS!)

---

### **3. Major Cloud Providers**

| Provider | Strengths | Popular in India |
|----------|-----------|------------------|
| **AWS** | Most features, largest | Flipkart, Ola, Swiggy |
| **Azure** | Microsoft integration | TCS, Infosys (enterprise) |
| **GCP** | Big Data, ML tools | Grofers, Dunzo |

**Free Tiers (Perfect for learning!):**
- AWS: 12 months free (EC2, RDS, S3)
- Azure: ₹13,300 credit for students
- GCP: ₹23,000 credit for 90 days
- Heroku: Free apps (with limits)
- Railway: $5 free credit

---

### **4. Cloud Deployment Architecture**

**Indian Startup Stack (Typical):**
```
User → Cloudflare (CDN) → 
    AWS Load Balancer → 
        EC2 Instances (App servers) → 
            RDS (PostgreSQL) → 
                S3 (File storage) → 
                    Redis (Caching)
```

---

## 💻 Hands-On Tasks (75-90 minutes)

### **Task 1: Deploy Flask API to Railway (Free!)** (25 mins)

**Railway.app - FREE PaaS (No credit card needed!)**

**Prepare your app:**

```python
# app.py (simple API)
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Hello from the Cloud!',
        'service': 'Railway.app',
        'environment': os.getenv('ENVIRONMENT', 'production')
    })

@app.route('/api/status')
def status():
    return jsonify({'status': 'healthy', 'version': '1.0.0'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

**Create requirements.txt:**
```txt
Flask==2.3.0
gunicorn==21.2.0
```

**Create Procfile:**
```
web: gunicorn app:app
```

**Deploy Steps:**
```bash
# 1. Initialize Git (if not already)
git init
git add .
git commit -m "Initial commit for cloud deployment"

# 2. Go to railway.app
# 3. Sign up with GitHub
# 4. Click "New Project" → "Deploy from GitHub repo"
# 5. Select your repository
# 6. Railway auto-detects Python and deploys!

# Your app will be live at: https://your-app.up.railway.app
```

**Test your deployed API:**
```bash
curl https://your-app.up.railway.app/
curl https://your-app.up.railway.app/api/status
```

---

### **Task 2: Environment Variables & Secrets** (20 mins)

**NEVER commit secrets to Git!**

```python
# ❌ BAD - Secrets in code
DATABASE_URL = "postgresql://user:password123@localhost/db"
SECRET_KEY = "my-secret-key-abc123"

# ✅ GOOD - Use environment variables
import os
DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
```

**Create `.env` file (local development):**
```env
DATABASE_URL=postgresql://localhost/mydb
SECRET_KEY=local-dev-secret-key
DEBUG=True
```

**Add to `.gitignore`:**
```
.env
*.pyc
__pycache__/
venv/
```

**Set on Railway:**
1. Go to your project → Variables tab
2. Add:
   - `DATABASE_URL`: (your database URL)
   - `SECRET_KEY`: (generate random key)
   - `ENVIRONMENT`: production

**Use python-dotenv:**
```bash
pip install python-dotenv
```

```python
# app.py
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env in development

DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
```

---

### **Task 3: Deploy Database (PostgreSQL on Railway)** (20 mins)

**Add PostgreSQL to your Railway project:**

```bash
# In Railway dashboard:
# 1. Click "+ New" → Database → PostgreSQL
# 2. Railway creates DB and provides connection URL
# 3. Copy DATABASE_URL from Variables tab
```

**Update your app to use cloud database:**

```python
# database.py
import os
import psycopg2

def get_db_connection():
    return psycopg2.connect(os.getenv('DATABASE_URL'))

# Create tables on first deploy
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS visitors (
            id SERIAL PRIMARY KEY,
            ip_address VARCHAR(50),
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cur.close()
    conn.close()

# app.py
from flask import Flask, request, jsonify
from database import get_db_connection, init_db

app = Flask(__name__)

# Initialize database on startup
with app.app_context():
    init_db()

@app.route('/')
def home():
    # Track visitor
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO visitors (ip_address) VALUES (%s)",
        (request.remote_addr,)
    )
    conn.commit()
    
    cur.execute("SELECT COUNT(*) FROM visitors")
    visitor_count = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return jsonify({
        'message': 'Hello from the Cloud!',
        'total_visitors': visitor_count
    })
```

**Update requirements.txt:**
```txt
Flask==2.3.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

**Deploy:**
```bash
git add .
git commit -m "Add PostgreSQL database integration"
git push

# Railway auto-deploys on push!
```

---

### **Task 4: AWS Free Tier Basics** (25 mins)

**Setup AWS Account (12-month free tier):**

1. Go to aws.amazon.com
2. Create account (needs credit card, but won't charge for free tier)
3. Go to EC2 → Launch Instance

**Launch Free Tier EC2 Instance:**
```
AMI: Ubuntu 22.04 LTS (Free tier eligible)
Instance Type: t2.micro (1GB RAM, Free tier)
Key Pair: Create new (download .pem file)
Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
Storage: 30GB (Free tier)
```

**Connect via SSH:**
```bash
# Make key private
chmod 400 your-key.pem

# Connect
ssh -i your-key.pem ubuntu@ec2-13-23-45-67.ap-south-1.compute.amazonaws.com
```

**Deploy Flask app on EC2:**
```bash
# On EC2 instance
sudo apt update
sudo apt install python3-pip python3-venv nginx -y

# Clone your code
git clone https://github.com/your-username/your-app.git
cd your-app

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run with gunicorn
gunicorn --bind 0.0.0.0:5000 app:app

# Configure nginx (reverse proxy)
sudo nano /etc/nginx/sites-available/default
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-ec2-public-ip;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo systemctl restart nginx

# Now visit: http://your-ec2-public-ip
```

---

### **Task 5: Cost Optimization** (10 mins)

**Cloud Cost Management Tips:**

```python
# cost_calculator.py
def estimate_monthly_cost():
    """Estimate AWS costs for small app"""
    
    costs = {
        'EC2 t2.micro': 0,  # Free tier
        'RDS db.t3.micro': 0,  # Free tier (750 hrs/month)
        'S3 storage': 0,  # Free tier (5GB)
        'Data transfer': 0,  # Free tier (15GB out)
        
        # After free tier:
        'EC2 (after)': 8.50 * 730 / 1000,  # ~$6/month
        'RDS (after)': 0.017 * 730,  # ~$12/month
        'S3 (100GB)': 0.023 * 100,  # ~$2/month
    }
    
    print("=== Cloud Cost Estimate (India) ===")
    print("\nFree Tier (12 months):")
    print("  Total: $0/month (₹0)")
    
    print("\nAfter Free Tier:")
    total_usd = sum([
        costs['EC2 (after)'],
        costs['RDS (after)'],
        costs['S3 (100GB)']
    ])
    total_inr = total_usd * 83  # USD to INR
    
    print(f"  Total: ${total_usd:.2f}/month (₹{total_inr:.0f})")
    
    print("\n💡 Tips to Save:")
    print("  - Use PaaS (Railway, Heroku) for small apps")
    print("  - Turn off dev servers when not in use")
    print("  - Use serverless for low-traffic apps")
    print("  - Monitor with AWS Cost Explorer")

estimate_monthly_cost()
```

---

## ✅ Verification Checklist

Before Day 22:

- [ ] Deployed at least one app to cloud (Railway/Heroku)
- [ ] Understand IaaS vs PaaS vs SaaS
- [ ] Know how to use environment variables
- [ ] Connected cloud database to your app
- [ ] Understand cloud pricing basics
- [ ] Can SSH into an EC2 instance

---

## 📖 Resources

- **AWS Free Tier:** [aws.amazon.com/free](https://aws.amazon.com/free)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app/)
- **Azure for Students:** Free ₹13,300 credit

---

## 💡 Connection to Future Roles

| Role | Cloud Usage |
|------|-------------|
| **DevOps Engineer** | 90% cloud infrastructure management |
| **Backend Developer** | Deploy APIs, manage databases |
| **Full Stack** | Deploy complete apps |
| **Cloud Architect** | ₹15-25 LPA (design cloud solutions) |

---

## 🚀 Wrap Up

**Congratulations! Your app is now on the INTERNET!** 🌍

Tomorrow: **Day 22 - Docker** (Containerize your app!)

[← Day 20: Auth & Security](../Module%204%20-%20Databases%20&%20Backend%20(Days%2016-20)/Day%2020%20-%20User%20Authentication%20&%20Security.md) | [Day 22: Docker →](./Day%2022%20-%20Containerization%20(Docker).md)
