# 📅 Day 11: The Command Line (Linux) - The Developer's Power Tool

**Module:** Software Engineering Tools (Days 11-15)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Moderate - requires practice)

---

## 🎯 Today's Objectives

By end of today, you will:
- Navigate Linux file system like a pro
- Master essential terminal commands
- Understand file permissions and ownership
- Use pipes and redirection for powerful workflows
- Write basic bash scripts for automation

**Real-world relevance:** 99% of servers run Linux. Command line is 10x faster than GUI for many tasks. CRITICAL skill for DevOps, Backend, Cloud roles.

---

## 📚 Theory (45-60 minutes)

### **1. Why Linux/Command Line?**

**Reality Check:**
- **Web servers:** 96% Linux (Apache, Nginx)
- **Android:** Built on Linux kernel
- **Cloud:** AWS, Google Cloud, Azure all use Linux
- **Indian startups:** Flipkart, Paytm, Zomato → Linux servers

**Command Line vs GUI:**
```
GUI: Click 100 files, right-click, delete (2 minutes)
CLI: rm *.log (instant!)

GUI: Rename 1000 files manually (impossible!)
CLI: for f in *.txt; do mv "$f" "${f%.txt}.md"; done (instant!)
```

---

### **2. Linux File System Hierarchy (FHS)**

```
/                    ← Root (NOT C:\)
├── home/           ← User home directories
│   ├── rajesh/     ← Your files
│   └── priya/
├── etc/            ← Configuration files
├── var/            ← Variable data (logs, databases)
│   └── log/        ← System logs
├── usr/            ← User programs
│   └── bin/        ← User binaries (commands)
├── bin/            ← Essential binaries (ls, cd, etc.)
├── tmp/            ← Temporary files
└── opt/            ← Optional software
```

**Key Directories:**
- `/home/username` → Your workspace (like C:\Users\Name)
- `/etc` → Config files (like Windows Registry)
- `/var/log` → System logs
- `/tmp` → Temporary files (cleared on reboot)

---

### **3. Essential Commands - Must Know**

#### **Navigation:**
```bash
pwd                    # Print Working Directory (where am I?)
ls                     # List files
ls -l                  # Long format (permissions, size, date)
ls -lh                 # Human-readable sizes (1.5G instead of 1500000000)
ls -a                  # Show hidden files (.bashrc, .git)
cd /path/to/directory  # Change directory
cd ~                   # Go home (/home/username)
cd ..                  # Go up one level
cd -                   # Go to previous directory
```

#### **File Operations:**
```bash
touch file.txt         # Create empty file
mkdir folder           # Make directory
mkdir -p a/b/c         # Make nested directories
cp source dest         # Copy file
cp -r folder1 folder2  # Copy directory recursively
mv old.txt new.txt     # Move/Rename
rm file.txt            # Delete file
rm -r folder           # Delete directory
rm -rf folder          # Force delete (DANGEROUS!)
```

⚠️ **WARNING:** `rm -rf /` deletes EVERYTHING! No trash bin in Linux!

#### **Viewing Files:**
```bash
cat file.txt           # Display entire file
less file.txt          # View large files (scrollable, press 'q' to quit)
head -n 20 file.txt    # First 20 lines
tail -n 50 file.txt    # Last 50 lines
tail -f /var/log/app.log  # Follow live logs (live updates!)
```

#### **Search:**
```bash
grep "error" app.log   # Find lines containing "error"
grep -i "ERROR" app.log  # Case-insensitive
grep -r "TODO" .       # Recursive search in all files
find . -name "*.py"    # Find all Python files
find . -type f -size +10M  # Find files larger than 10MB
```

---

### **4. File Permissions - The rwx System**

```bash
ls -l file.txt
-rw-r--r-- 1 rajesh developers 1024 Jan 17 12:00 file.txt
│││││││││  │   │      │         │     │
│└┴┴┴┴┴┴┴┴ Owner Group Size  Date  Name
│
└── File type: - (file), d (directory), l (link)

rw-r--r--
│││ │││ │││
││└ Owner permissions (read, write, execute)
│└─ Group permissions
└── Others permissions

r = read (4)
w = write (2)
x = execute (1)
```

**Example:**
```
rw-r--r-- = 644
│││ │││ │││
││└ Owner: rw- = 4+2+0 = 6
│└─ Group: r-- = 4+0+0 = 4
└── Others: r-- = 4+0+0 = 4

rwxr-xr-x = 755 (typical for scripts)
rwx------ = 700 (private file)
```

**Changing Permissions:**
```bash
chmod 755 script.sh    # rwxr-xr-x
chmod +x script.sh     # Add execute permission
chmod -w file.txt      # Remove write permission
chmod u+x,g-w file.txt # User add exec, group remove write

# Ownership
chown rajesh:developers file.txt  # Change owner and group
chown rajesh file.txt             # Change owner only
```

**Indian Example - Web Server:**
```bash
# Web files should be readable by web server (www-data)
chown -R www-data:www-data /var/www/paytm.com
chmod -R 644 /var/www/paytm.com/*.html
chmod -R 755 /var/www/paytm.com/scripts/
```

---

### **5. Pipes & Redirection - Composing Commands**

#### **Redirection:**
```bash
echo "Hello" > file.txt         # Overwrite file
echo "World" >> file.txt        # Append to file
cat < input.txt                 # Read from file
command 2> errors.log           # Redirect errors only
command &> all_output.log       # Redirect everything
command > output.txt 2>&1       # Redirect stdout and stderr to same file
```

#### **Pipes (|) - Chain Commands:**
```bash
# Count lines in a file
cat app.log | wc -l

# Find errors and count them
grep "ERROR" app.log | wc -l

# Find top 10 most common errors
grep "ERROR" app.log | sort | uniq -c | sort -nr | head -10

# Real DevOps example: Find IPs hitting your server most
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -10
```

**Breaking it down:**
```
cat access.log          # Read log file
| awk '{print $1}'      # Extract first column (IP address)
| sort                  # Sort IPs
| uniq -c               # Count unique IPs
| sort -nr              # Sort by count (descending)
| head -10              # Top 10
```

---

### **6. Environment Variables**

```bash
echo $HOME              # /home/rajesh
echo $PATH              # Where system looks for commands
echo $USER              # Current user

# Set variable
export API_KEY="abc123"
export DB_PASSWORD="secret"

# View all
env
printenv

# Make permanent (add to ~/.bashrc)
echo 'export API_KEY="abc123"' >> ~/.bashrc
source ~/.bashrc  # Reload config
```

**Indian Example - Django App:**
```bash
export DATABASE_URL="postgresql://user:pass@localhost/paytm_db"
export SECRET_KEY="django-secret-key-here"
export DEBUG="False"
python manage.py runserver
```

---

## 💻 Hands-On Tasks (60-90 minutes)

### **Task 1: File System Navigation** (15 mins)

**Create a project structure:**

```bash
# Navigate to home
cd ~

# Create project
mkdir -p projects/ecommerce/{frontend,backend,database,docs}
cd projects/ecommerce

# Create files
touch frontend/index.html frontend/style.css frontend/app.js
touch backend/server.py backend/models.py backend/views.py
touch database/schema.sql database/migrations.sql
touch docs/README.md docs/API.md

# Create logs
mkdir -p logs
touch logs/app-2024-01-{01..10}.log

# View structure
tree .   # If tree not installed: ls -R
# Or use: find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'

# Navigate
cd backend
pwd
cd ../frontend
ls -lh
cd ../..
pwd
```

**Document in `day11_navigation.md`:**
```bash
# Save directory structure
tree projects/ecommerce > day11_navigation.md
# Or
ls -R projects/ecommerce >> day11_navigation.md
```

---

### **Task 2: Permission Management** (20 mins)

**Scenario: Deploy a web application**

```bash
# Create deployment structure
mkdir -p ~/deploy/flipkart-clone
cd ~/deploy/flipkart-clone

# Create files
echo "#!/bin/bash" > start-server.sh
echo "python app.py" >> start-server.sh

echo "SECRET_KEY=abc123" > config.env
echo "DB_PASSWORD=secret123" >> config.env

echo "print('Hello from Flipkart clone!')" > app.py

# Check permissions
ls -l

# Fix permissions
chmod 700 config.env          # Only owner can read/write (security!)
chmod 755 start-server.sh     # Everyone can execute
chmod 644 app.py              # Owner can edit, others read

# Verify
ls -l

# Try to execute
./start-server.sh

# View as octal
stat -c "%a %n" *
```

**Document decisions in `day11_permissions.md`:**
```markdown
# Permission Decisions

- `config.env` (700): Contains secrets, only owner should access
- `start-server.sh` (755): Script that everyone can run
- `app.py` (644): Code file, owner can edit, others can read

Octal: 4=read, 2=write, 1=execute
```

---

### **Task 3: Command Pipelines** (25 mins)

**Analyze server logs:**

Create sample log:
```bash
cat > server.log << 'EOF'
2024-01-17 10:15:23 INFO Starting server on port 8000
2024-01-17 10:15:24 INFO Database connected
2024-01-17 10:16:01 ERROR Failed to process payment for order #12345
2024-01-17 10:16:15 WARNING High CPU usage: 85%
2024-01-17 10:17:22 ERROR Database connection lost
2024-01-17 10:17:23 ERROR Failed to process payment for order #12346
2024-01-17 10:18:45 INFO Server shutdown gracefully
2024-01-17 10:19:01 ERROR Failed to process payment for order #12347
2024-01-17 10:20:12 WARNING Memory usage: 90%
2024-01-17 10:21:33 INFO Request from 103.21.45.67
2024-01-17 10:22:44 ERROR Database query timeout
EOF

# Now analyze with pipes:

# 1. Count total errors
grep "ERROR" server.log | wc -l

# 2. Extract all error messages
grep "ERROR" server.log | awk '{$1=$2=$3=""; print $0}' | sed 's/^ *//'

# 3. Count each error type
grep "ERROR" server.log | awk '{print $4, $5, $6, $7}' | sort | uniq -c

# 4. Find top 3 most common errors
grep "ERROR" server.log | awk '{print $4, $5, $6}' | sort | uniq -c | sort -nr | head -3

# 5. Extract timestamps of errors
grep "ERROR" server.log | awk '{print $1, $2}'

# 6. Errors in last hour (assuming current time is 10:30)
grep "ERROR" server.log | awk '$2 >= "10:00:00" && $2 <= "10:30:00"'

# 7. Save errors to file
grep "ERROR" server.log > errors-only.log

# 8. Count by severity
awk '{print $3}' server.log | sort | uniq -c
```

**Create analysis script `analyze_logs.sh`:**
```bash
#!/bin/bash

LOG_FILE="server.log"

echo "=== Log Analysis ==="
echo "Total lines: $(wc -l < $LOG_FILE)"
echo "Errors: $(grep -c "ERROR" $LOG_FILE)"
echo "Warnings: $(grep -c "WARNING" $LOG_FILE)"
echo "Info: $(grep -c "INFO" $LOG_FILE)"

echo -e "\n=== Top 3 Errors ==="
grep "ERROR" $LOG_FILE | awk '{print $4, $5, $6}' | sort | uniq -c | sort -nr | head -3
```

Make executable and run:
```bash
chmod +x analyze_logs.sh
./analyze_logs.sh
```

---

### **Task 4: Write Bash Scripts** (30 mins)

**Script 1: Backup with timestamp**

Create `backup.sh`:
```bash
#!/bin/bash

# Configuration
SOURCE_DIR="$HOME/projects"
BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="project_backup_$DATE.tar.gz"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup of $SOURCE_DIR..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$SOURCE_DIR"

# Check if successful
if [ $? -eq 0 ]; then
    echo "✓ Backup created: $BACKUP_DIR/$BACKUP_NAME"
    echo "Size: $(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Delete backups older than 7 days
find "$BACKUP_DIR" -name "project_backup_*.tar.gz" -mtime +7 -delete
echo "Cleaned up old backups (>7 days)"
```

**Script 2: System monitoring**

Create `monitor.sh`:
```bash
#!/bin/bash

echo "=== System Monitor ==="
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo

echo "=== Disk Usage ==="
df -h | grep -E "^/dev/"
echo

echo "=== Memory Usage ==="
free -h
echo

echo "=== Top 5 CPU Processes ==="
ps aux --sort=-%cpu | head -6
echo

echo "=== Top 5 Memory Processes ==="
ps aux --sort=-%mem | head -6
echo

echo "=== Network Connections ==="
netstat -tuln | grep LISTEN | head -5 2>/dev/null || ss -tuln | grep LISTEN | head -5
```

**Script 3: Deploy automation (Indian startup)**

Create `deploy_paytm_clone.sh`:
```bash
#!/bin/bash

# Deployment script for Paytm Clone

PROJECT_NAME="paytm-clone"
APP_DIR="/var/www/$PROJECT_NAME"
GIT_REPO="https://github.com/user/paytm-clone.git"

echo "🚀 Deploying $PROJECT_NAME..."

# Pull latest code
cd "$APP_DIR" || exit 1
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt --quiet

# Run database migrations
echo "🗄️ Running migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Restart server
echo "🔄 Restarting server..."
sudo systemctl restart paytm-clone

# Check status
if systemctl is-active --quiet paytm-clone; then
    echo "✅ Deployment successful!"
    echo "🌐 Site: https://paytm-clone.example.com"
else
    echo "❌ Deployment failed! Check logs:"
    echo "   sudo journalctl -u paytm-clone -n 50"
    exit 1
fi
```

Make all executable:
```bash
chmod +x backup.sh monitor.sh deploy_paytm_clone.sh
```

---

### **Task 5: Real DevOps Scenario** (20 mins)

**Problem:** Find and fix issues in production logs

Create production log:
```bash
cat > production.log << 'EOF'
[2024-01-17 10:00:01] INFO User login: rajesh@example.com from 103.21.44.10
[2024-01-17 10:00:15] INFO Payment initiated: ₹1500 for order #12345
[2024-01-17 10:00:16] ERROR Payment gateway timeout for order #12345
[2024-01-17 10:00:30] INFO User login: priya@example.com from 103.21.44.11
[2024-01-17 10:01:05] ERROR Database connection failed: Connection refused
[2024-01-17 10:01:06] ERROR Payment failed for order #12346
[2024-01-17 10:02:12] WARNING Memory usage at 95%
[2024-01-17 10:03:22] ERROR Redis cache unavailable
[2024-01-17 10:04:10] INFO Payment successful: ₹2000 for order #12347
[2024-01-17 10:05:18] ERROR Payment gateway timeout for order #12348
EOF

# Tasks:
echo "=== Production Log Analysis ===

# 1. How many payment errors occurred?
grep "Payment.*ERROR" production.log | wc -l

# 2. Which orders failed?
grep "ERROR.*order #" production.log | grep -oP "order #\K\d+"

# 3. What time did database fail?
grep "Database connection failed" production.log | awk '{print $1, $2}'

# 4. Are there patterns in errors? (timeframe)
grep "ERROR" production.log | awk '{print $1, $2}'

# 5. Create alert report
echo "=== ALERT REPORT $(date) ===" > alert_report.txt
echo "Total Errors: $(grep -c ERROR production.log)" >> alert_report.txt
echo "Total Warnings: $(grep -c WARNING production.log)" >> alert_report.txt
echo -e "\nFailed Orders:" >> alert_report.txt
grep "ERROR.*order #" production.log | grep -oP "order #\K\d+" >> alert_report.txt
cat alert_report.txt
"
```

---

## ✅ Verification Checklist

Before moving to Day 12, ensure you can:

- [ ] Navigate the file system with `cd`, `ls`, `pwd`
- [ ] Create, copy, move, and delete files/directories
- [ ] Understand and change file permissions (rwx, 755, etc.)
- [ ] Use `grep` to search text
- [ ] Combine commands with pipes (`|`)
- [ ] Redirect output (`>`, `>>`)
- [ ] Write and execute bash scripts
- [ ] Use environment variables

**Self-Test:** Write a script that finds all `.log` files modified in last 24 hours and emails you a summary.

---

## 📖 Resources

### **Interactive Learning:**
- **OverTheWire: Bandit** - Learn Linux through challenges
- **LinuxJourney.com** - Step-by-step tutorials

### **Cheat Sheets:**
- Linux Command Line Cheat Sheet
- Bash Scripting Cheat Sheet

### **Books:**
- "The Linux Command Line" - William Shotts (free PDF)
- "Learning the Bash Shell" - O'Reilly

---

## 💡 Connection to Future Roles

| Role | Relevance |
|------|-----------|
| **DevOps Engineer** | 90% of work is command line automation |
| **Backend Developer** | Deploy apps, debug servers, view logs |
| **Cloud Engineer** | Manage AWS/Azure VMs via SSH |
| **Data Engineer** | Process large files, automate pipelines |
| **Cybersecurity** | Penetration testing, log analysis |
| **SRE** | Monitor systems, automate incident response |

---

## 🚀 Wrap Up & Next Steps

**Congratulations on completing Day 11!** 🎉

### **Before Day 12:**
1. Push to GitHub
   ```bash
   git add .
   git commit -m "Day 11: Linux Command Line mastery - scripts, permissions, pipes"
   git push
   ```

2. **Practice daily:** Use terminal instead of GUI for file operations

3. Share:
   ```
   Day 11/30: Linux Command Line ✅
   
   Wrote bash scripts for backup, monitoring, deployment!
   Pipelines & permissions mastered
   
   rm -rf is scary 😅
   
   #30DaysOfCode #Linux
   ```

4. **Tomorrow:** Day 12 - Git Internals (version control deep dive!)

---

**Fun Fact:** 90% of the world's servers run on Linux. Microsoft runs 50%+ of Azure on Linux! 🐧

[← Day 10: Non-Linear DS](../Module%202%20-%20Programming%20&%20Data%20Structures%20(Days%206-10)/Day%2010%20-%20Data%20Structures%20II%20(Non-Linear).md) | [Day 12: Git Internals →](./Day%2012%20-%20Version%20Control%20(Git%20Internals).md)
