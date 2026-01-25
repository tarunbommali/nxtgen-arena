# 🚀 NxtGenLabs - Engineering Learning & Competition Platform

> **Build. Compete. Evolve.**  
> A comprehensive platform for college students to participate in hackathons, follow structured roadmaps, practice DSA, and track their engineering journey.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.2.0-blue)](https://reactjs.org/)

---

## ✨ Features

### 🎯 **For Students**
- 📅 **Events & Hackathons** - Discover and register for 30/60/90 day challenges, hackathons, contests
- 🗺️ **Learning Roadmaps** - Follow structured paths (Full Stack, DSA, DevOps, AI/ML)
- 💻 **DSA Practice** - Solve 200+ concept-focused problems (not language-specific)
- 📊 **Progress Tracking** - Track completion across roadmaps, DSA problems, and events
- 🏆 **Achievements** - Earn badges, maintain streaks, view statistics

### 🔧 **For Admins**
- ➕ **Content Management** - Create/edit/delete events, roadmaps, and DSA problems
- 📈 **Analytics Dashboard** - View platform statistics and user engagement
- 👥 **User Management** - Manage registrations and submissions

---

## 🏗️ Tech Stack

### **Frontend (Client)**
- ⚛️ **React 19** - UI framework
- ⚡ **Vite** - Build tool
- 🎨 **TailwindCSS 4** - Styling
- 🎭 **Framer Motion** - Animations
- 🔥 **Firebase** - Authentication (Google OAuth)
- 🧭 **React Router** - Navigation

### **Backend (Server)**
- 🟢 **Node.js + Express** - REST API
- 🗄️ **MySQL** - Database
- 🔐 **JWT** - Authentication & authorization
- 🔒 **bcrypt** - Password hashing

---

## 📁 Project Structure

```
nxtgenlabs/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API calls
│   │   ├── context/     # Global state
│   │   └── data/        # Static JSON (temp)
│   └── package.json
│
├── server/              # Node.js backend (Express)
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── controllers/ # Request handlers  
│   │   ├── routes/      # API endpoints
│   │   └── middlewares/ # Auth, validation
│   └── package.json
│
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

See [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) for detailed structure.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd ContestApplication

# 2. Install dependencies (root + client + server)
npm run install:all

# 3. Configure environment variables
# Create .env files in client/ and server/
# See SETUP_GUIDE.md for details

# 4. Setup database
mysql -u root -p
CREATE DATABASE nxtgenlabs;

# 5. Start development servers
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:5000

See [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) for detailed setup instructions.

---

## 📚 Documentation

- 📘 **[Setup Guide](./SETUP_GUIDE.md)** - Installation and configuration
- 📗 **[Project Structure](./PROJECT_STRUCTURE.md)** - Folder organization
- 📙 **[API Documentation](./server/API_DOCS.md)** - REST API reference
- 📕 **[Sync Guide](./server/SYNC_GUIDE.md)** - Backend-frontend integration

---

## 🔧 Development Scripts

### Root Level (Run both)
```bash
npm run dev              # Start client + server concurrently
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
npm run install:all      # Install all dependencies
npm run seed             # Seed database with sample data
```

### Frontend
```bash
cd client
npm run dev              # Dev server (port 5173)
npm run build            # Production build
npm run preview          # Preview production build
```

### Backend
```bash
cd server
npm run dev              # Dev server with nodemon
npm start                # Production server
npm run seed             # Populate database
```

---

## 🗄️ Database Schema

The platform uses **8 MySQL tables**:

- `users` - User accounts (students & admins)
- `events` - Hackathons, challenges, contests
- `roadmaps` - Learning paths with levels and phases
- `dsa_problems` - Practice problems
- `event_registrations` - User event signups
- `user_progress` - Roadmap completion tracking
- `dsa_progress` - Problem solve tracking  
- `submissions` - User code submissions

Tables are auto-created on first server start.

---

## 📡 API Endpoints

### Public
```
GET  /api/events              # All events
GET  /api/roadmaps            # All roadmaps
GET  /api/dsa-problems        # All DSA problems
POST /api/auth/register       # User registration
POST /api/auth/login          # User login
```

### Authenticated (Student)
```
POST /api/progress/event/register  # Register for event
POST /api/progress/dsa/toggle      # Mark problem solved
GET  /api/progress/dsa/stats       # Get statistics
```

### Admin Only
```
POST   /api/events              # Create event
PUT    /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
# ... similar for roadmaps and DSA problems
```

Full API reference: [`server/API_DOCS.md`](./server/API_DOCS.md)

---

## 👤 User Roles

### **Student** (Default)
- View all events, roadmaps, DSA problems
- Register for events
- Track personal progress
- Submit solutions

### **Admin**
- All student permissions
- Create/edit/delete events
- Create/edit/delete roadmaps
- Create/edit/delete DSA problems
- View all user data

**Create admin account:**
```bash
POST http://localhost:5000/api/auth/register
{
  "username": "admin",
  "email": "admin@email.com",
  "password": "SecurePass123",
  "role": "admin"
}
```

---

## 🎨 Key Features Showcase

### 1. **Modern Landing Page**
- Hero section with gradient effects
- Feature cards with glassmorphism
- Active events showcase
- Roadmap previews
- DSA practice stats
- Student journey visualization

### 2. **User Dashboard**
- Personal statistics (events, submissions, completed)
- Registered initiatives table
- Tabbed interface (My Initiatives, Recommended, Applications)
- Progress tracking

### 3. **Events System**
- Grid/list view of events
- Advanced filtering (status, type, tags)
- Event detail pages with tabs (Roadmap, Resources, Challenges)
- One-click registration

### 4. **Roadmap System**
- 3 levels: Beginner → Intermediate → Advanced
- Expandable phases with goals, topics, resources
- Project checklists
- Progress bars
- Capstone projects

### 5. **DSA Practice**
- 200+ problems across 6 categories
- Concept-focused (language-agnostic)
- Multiple solving approaches
- Complexity analysis
- Filter by difficulty/status
- Track solved problems

---

## 🔐 Security Features

- ✅ JWT authentication with 7-day expiry
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Firebase Google OAuth
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ⚠️ **TODO:** Rate limiting, input validation, HTTPS in production

---

## 📊 Sample Data

The seed script populates:
- **6 Events** (hackathons, challenges, workshops)
- **3 Roadmaps** (Full Stack, DSA, DevOps)
- **22 DSA Problems** (Arrays, Trees, DP, Graphs, etc.)

```bash
npm run seed
```

---

## 🚢 Deployment

### Frontend (Vite App)
- **Vercel / Netlify** (recommended)
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Backend (Node.js API)
- **Railway / Render** (recommended)
- **Heroku**
- **AWS EC2 / ECS**
- **DigitalOcean App Platform**

### Database
- **PlanetScale** (MySQL - recommended)
- **AWS RDS**
- **DigitalOcean Managed MySQL**

See deployment guide in `/docs` (coming soon).

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**NxtGenLabs** - Engineering Learning Platform  
Built for students, by students.

---

## 🔗 Links

- 📖 Documentation: `/docs`
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Happy Coding! 🚀**
