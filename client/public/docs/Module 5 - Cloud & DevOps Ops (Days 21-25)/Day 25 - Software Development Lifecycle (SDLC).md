# 📅 Day 25: Software Development Lifecycle (SDLC) - The Complete Picture

**Module:** Cloud & DevOps (Days 21-25)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐☆☆

---

## 🎯 Objectives

Understand the full software development process:
- SDLC phases (Planning → Deployment)
- Agile vs Waterfall methodologies
- Scrum framework (sprints, stand-ups)
- DevOps culture
- Real-world project workflow

**Why this matters:** Every company follows an SDLC. Understanding this = ready for professional teams!

---

## 📚 Theory (30-40 mins)

### **1. SDLC Phases**

```
1. Planning        → What to build? Why?
2. Analysis        → Requirements gathering
3. Design          → Architecture, database schema
4. Implementation  → Write code!
5. Testing         → Find bugs
6. Deployment      → Release to users
7. Maintenance     → Fix issues, add features
```

---

### **2. Waterfall vs Agile**

**Waterfall (Old Way):**
```
Planning (3 months) → Design (2 months) → Code (6 months) → Test (2 months) → Deploy
                                                                              ↓
                                                                         ✅ or ❌

Problem: See results only after 12+ months!
```

**Agile (Modern Way):**
```
Sprint 1 (2 weeks): Plan → Design → Code → Test → Deploy → ✅ Working feature!
Sprint 2 (2 weeks): Plan → Design → Code → Test → Deploy → ✅ Another feature!
Sprint 3...

Benefits: Feedback every 2 weeks, pivot quickly!
```

---

### **3. Scrum Framework**

**Roles:**
- Product Owner: What to build
- Scrum Master: Remove blockers
- Development Team: Build it!

**Ceremonies:**
- Sprint Planning: What will we build this sprint?
- Daily Stand-up: 15-min sync (What I did, what I'll do, blockers)
- Sprint Review: Demo to stakeholders
- Retrospective: What went well? What to improve?

**Artifacts:**
- Product Backlog: All features wanted
- Sprint Backlog: Features for this sprint
- Increment: Working software at sprint end

---

### **4. Indian Startup SDLC Example**

**Flipkart feature: "Buy Now Pay Later"**

```
Week 1: Planning
- Product Owner: "We want BNPL to increase sales"
- Team estimates: 3sprints (6 weeks)

Week 2-3: Sprint 1 - Backend
- Design database schema
- Build payment API
- Unit tests
- Deploy to staging

Week 4-5: Sprint 2 - Frontend
- UI for BNPL option
- Integration with backend
- E2E tests
- Deploy to staging

Week 6-7: Sprint 3 - Launch
- Security audit
- Load testing (can handle 1M users?)
- Deploy to production (10% users first)
- Monitor metrics
- Full rollout if successful!
```

---

## 💻 Hands-On Tasks (70-80 mins)

### **Task 1: Agile Project Simulation** (30 mins)

**Simulate a 2-week sprint:**

**Sprint Planning Document:**
```markdown
# Sprint 3: User Profile Feature

## Goal
Allow users to update profile and upload profile picture

## User Stories
1. As a user, I want to edit my profile details
2. As a user, I want to upload a profile picture
3. As a user, I want to see my order history

## Definition of Done
- Code written and reviewed
- Unit tests passed
- Deployed to staging
- Product owner approved

## Sprint Backlog
- [ ] Day 1-2: Design database schema
- [ ] Day 3-4: Backend API (GET/PUT /api/profile)
- [ ] Day 5-6: File upload (profile picture)
- [ ] Day 7-8: Frontend UI
- [ ] Day 9: Integration testing
- [ ] Day 10: Deploy + demo

## Team Capacity
- 2 backend developers
- 1 frontend developer
- 1 QA engineer
```

**Daily Stand-up Notes:**
```
Day 1 Stand-up:
- Rajesh: Yesterday: Sprint planning. Today: Database schema. Blockers: None.
- Priya: Yesterday: Sprint planning. Today: API endpoint design. Blockers: Need database schema from Rajesh.
- Amit: Yesterday: Sprint planning. Today: Setup frontend project. Blockers: None.
```

---

### **Task 2: Git Workflow (Professional Team)** (25 mins)

**Feature Branch Workflow:**

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/user-profile

# 2. Work on feature (multiple commits)
git add profile_api.py
git commit -m "Add GET /api/profile endpoint"

git add profile_update.py
git commit -m "Add PUT /api/profile endpoint"

git add tests/test_profile.py
git commit -m "Add profile API tests"

# 3. Push feature branch
git push origin feature/user-profile

# 4. Create Pull Request on GitHub
# 5. Code review by team
# 6. Address review comments
git add profile_api.py
git commit -m "Fix validation logic per review"
git push origin feature/user-profile

# 7. Once approved, merge to main
# 8. Delete feature branch
git checkout main
git pull origin main
git branch -d feature/user-profile
```

---

### **Task 3: Production Deployment Checklist** (20 mins)

**Pre-Deployment Checklist:**
```markdown
## Before Deploying to Production

### Code Quality
- [ ] All tests passing (unit + integration)
- [ ] Code review approved
- [ ] No console.log() or print() debugging statements
- [ ] Code linted (flake8, eslint)

### Security
- [ ] No secrets in code (use environment variables)
- [ ] SQL injection prevented (parameterized queries)
- [ ] Authentication implemented
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

### Performance
- [ ] Database indexes added
- [ ] Caching implemented (Redis)
- [ ] Large queries optimized
- [ ] Image compression enabled

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Logging configured
- [ ] Alerting rules defined

### Rollback Plan
- [ ] Database migration has rollback script
- [ ] Previous version Docker image tagged
- [ ] Rollback procedure documented

### Communication
- [ ] Team notified of deployment
- [ ] Users notified (if breaking changes)
- [ ] Support team briefed
```

---

### **Task 4: Incident Response Playbook** (15 mins)

**When production breaks:**

```markdown
## Production Incident Response

### Severity Levels
- **P0 (Critical)**: Site down, data loss
- **P1 (High)**: Major feature broken
- **P2 (Medium)**: Minor feature issue
- **P3 (Low)**: Cosmetic issue

### P0 Incident Response
1. **Detect** (1 min)
   - Alert from monitoring tool
   - User reports

2. **Acknowledge** (2 min)
   - Post in #incidents Slack channel
   - Assign incident commander

3. **Mitigate** (15 min)
   - Rollback to previous version
   - OR Apply hotfix
   - Verify site is back up

4. **Investigate** (After mitigation)
   - Check logs
   - Find root cause
   - Write postmortem

5. **Prevent** (Next sprint)
   - Add monitoring/alerts
   - Fix underlying issue
   - Update runbook

### Communication Template
```
🚨 INCIDENT ALERT 🚨
Severity: P0
Impact: Payment API down
Start Time: 14:30 IST
Status: Investigating

Update 1 (14:35): Identified database connection issue
Update 2 (14:40): Rolling back to v1.2.3
Update 3 (14:45): ✅ RESOLVED - Site is back up

Postmortem: [Link to doc]
```
```

---

## 📊 Real Company Examples

**How Indian Startups Work:**

| Company | SDLC | Tech Stack | Team Size |
|---------|------|------------|-----------|
| **Razorpay** | Agile (2-week sprints) | Node.js, Go, PostgreSQL | 500+ engineers |
| **CRED** | Agile + weekly releases | Kotlin, Python, Redis | 200+ engineers |
| **Swiggy** | Agile + daily deploys | Java, Python, Cassandra | 800+ engineers |

---

## ✅ Verification Checklist

- [ ] Understand all SDLC phases
- [ ] Know difference between Agile and Waterfall
- [ ] Can explain Scrum ceremonies
- [ ] Understand professional Git workflow
- [ ] Know production deployment checklist

---

## 🎓 **MODULE 5 COMPLETE - Knowledge Checkpoint**

### **🎉 Congratulations! Module 5: Cloud & DevOps Complete!**

### **📚 What You Learned (Days 21-25)**

#### **Day 21: Cloud Computing**
- ✅ Deployed apps to Railway/Heroku
- ✅ IaaS vs PaaS vs SaaS
- ✅ AWS EC2 basics
- ✅ Environment variables & secrets

#### **Day 22: Docker**
- ✅ Containerization concepts
- ✅ Dockerfile and Docker Compose
- ✅ Multi-stage builds
- ✅ Docker Hub registry

#### **Day 23: CI/CD**
- ✅ GitHub Actions workflows
- ✅ Automated testing
- ✅ Continuous deployment
- ✅ Build status badges

#### **Day 24: Testing**
- ✅ Unit, integration, E2E tests
- ✅ Test-Driven Development
- ✅ Code coverage (>80%)
- ✅ Mocking external services

#### **Day 25: SDLC**
- ✅ Agile vs Waterfall
- ✅ Scrum framework
- ✅ Professional Git workflow
- ✅ Production deployment practices

---

### **📹 MANDATORY: Record Your Learning (5 minutes)**

**Recording Task:**

Record a **5-minute video/audio** explaining:

1. **Cloud Deployment Demo (2 min):**
   - Show your deployed app running in the cloud
   - Explain: "I push code → GitHub Actions → Tests run → Deploys automatically"
   - Demonstrate: Make a code change → Push → Wait → See it live!

2. **Docker Walkthrough (1.5 min):**
   - Show your Dockerfile
   - Run `docker-compose up` for your app
   - Explain: "Everything my app needs is in this container"

3. **Professional Workflow (1.5 min):**
   - Explain your team's SDLC (even if solo: "How I would work in a team")
   - Show Git branches, PRs, testing workflow
   - "This is how Flipkart/Swiggy teams work daily"

**Save as:** `recordings/module_5_cloud_devops.mp4`

---

### **🎯 Module 5 Mastery Check**

**Can you do these?**
- [ ] Deploy an app to cloud in under 10 minutes
- [ ] Write a Dockerfile from scratch
- [ ] Setup CI/CD pipeline with automated tests
- [ ] Write unit and integration tests
- [ ] Explain Agile/Scrum to a non-technical person

**Can you answer these?**
- [ ] Docker vs Virtual Machine difference?
- [ ] What triggers a CI/CD pipeline?
- [ ] Why write tests before code (TDD)?
- [ ] Agile vs Waterfall: when to use each?

---

### **🔗 Real-World Skills Achieved**

**You can now work at:**

| Role | Skills From Module 5 | Salary (India) |
|------|---------------------|----------------|
| **DevOps Engineer** | Cloud + Docker + CI/CD | ₹10-18 LPA |
| **Backend Developer** | Deployment + Testing | ₹8-14 LPA |
| **Full Stack** | End-to-end delivery | ₹10-16 LPA |
| **SRE (Site Reliability)** | All Module 5 + Module 1-4 | ₹15-25 LPA |

---

### **📊 Progress Checkpoint**

**✅ Completed:** Days 1-25 (83% of 30-day foundation!)  
**⏭️ Next:** Module 6 - Capstone Project (Days 26-30)  
**🎯 Achievement:** You have PRODUCTION-READY full-stack + DevOps skills!  

---

### **🎯 Before Starting Module 6**

**Required:**
1. ✅ Record 5-minute cloud/DevOps demo (see above)
2. ✅ Deploy at least 1 app to cloud (with database!)
3. ✅ Setup CI/CD for automatic deployment
4. ✅ Push everything to GitHub

**Recommended:**
- Deploy 2-3 different projects to practice
- Get AWS/Azure certification (free tier practice)
- Join DevOps communities (Reddit r/devops, Discord servers)

---

### **⏸️ FINAL MODULE BREAK!**

**Module 5 was INTENSE!** You learned industry-standard DevOps practices.

- ✅ **Celebrate** - You can now deploy apps like a professional!
- ✅ **Practice** - Deploy everything you've built
- ✅ **Prepare** - Module 6 is your CAPSTONE (final project!)

**What's in Module 6:**
- 📝 Technical documentation writing
- 🗓️ Project planning like a PM
- 💻 Build a complete portfolio project (3 days)
- 🎯 Code review & reflection

**This is the FINAL stretch! 5 days to complete the transformation! 💪**

---

**"DevOps is not a role, it's a culture. You now live that culture!" 🚀**

**Tomorrow:** Day 26 - Technical Documentation (Final module begins!)

[← Day 24: Testing](./Day%2024%20-%20Testing%20Methodologies.md) | [Module 6: Day 26 - Documentation →](../Module%206%20-%20Capstone%20&%20Professional%20Skills%20(Days%2026-30)/Day%2026%20-%20Technical%20Documentation.md)
