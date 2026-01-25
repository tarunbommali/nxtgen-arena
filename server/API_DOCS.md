# 🚀 NxtGenLabs REST API Documentation

**Version:** 2.0.0  
**Base URL:** `http://localhost:5000/api`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Events](#events)
3. [Roadmaps](#roadmaps)
4. [DSA Problems](#dsa-problems)
5. [User Progress](#user-progress)

---

## 🔐 Authentication

### Register User
Create a new student or admin account.

**Endpoint:** `POST /auth/register`  
**Access:** Public

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "student" // Optional: "student" or "admin"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

## 🎯 Events

### Get All Events
Retrieve list of all events (hackathons, challenges, contests).

**Endpoint:** `GET /events`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "google_cloud_ai_labs",
      "name": "Google Cloud AI Labs Series",
      "type": "challenge",
      "status": "active",
      "description": "Learn Google Cloud AI tools...",
      "tags": ["Free", "In Person"],
      "location": "Multiple Cities, India",
      "eventStartDate": "2026-03-01T10:00:00",
      "totalParticipants": 2547,
      "registrationStatus": "open"
    }
  ]
}
```

### Get Events by Status
Filter events by status (active, upcoming, completed).

**Endpoint:** `GET /events/status/:status`  
**Access:** Public

**Example:** `GET /events/status/active`

### Get Event by ID
Get detailed information about a specific event.

**Endpoint:** `GET /events/:id`  
**Access:** Public

**Example:** `GET /events/google_cloud_ai_labs`

### Create Event (Admin Only)
Create a new event.

**Endpoint:** `POST /events`  
**Access:** Private (Admin)  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "my_event_id",
  "name": "My Event",
  "type": "hackathon",
  "status": "upcoming",
  "description": "Event description",
  "tags": ["AI", "Web"],
  "location": "Online",
  "registrationDeadline": "2026-04-01T23:59:59",
  "eventStartDate": "2026-04-15T10:00:00",
  "eventEndDate": "2026-04-17T18:00:00",
  "organizer": "NxtGenLabs",
  "difficulty": "intermediate",
  "registrationStatus": "open",
  "prizes": ["₹50,000", "Certificates"],
  "rounds": []
}
```

### Update Event (Admin Only)
Update an existing event.

**Endpoint:** `PUT /events/:id`  
**Access:** Private (Admin)  
**Headers:** `Authorization: Bearer <token>`

### Delete Event (Admin Only)
Delete an event.

**Endpoint:** `DELETE /events/:id`  
**Access:** Private (Admin)  
**Headers:** `Authorization: Bearer <token>`

---

## 🗺️ Roadmaps

### Get All Roadmaps
Retrieve all learning roadmaps.

**Endpoint:** `GET /roadmaps`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "fullstack_roadmap",
      "roadmapName": "Software Engineering Full Stack Roadmap",
      "totalDurationMonths": 12,
      "levels": [...],
      "careerOutcome": ["Full Stack Developer", "Backend Engineer"]
    }
  ]
}
```

### Get Roadmap by ID
Get detailed roadmap with all levels and phases.

**Endpoint:** `GET /roadmaps/:id`  
**Access:** Public

**Example:** `GET /roadmaps/fullstack_roadmap`

### Create Roadmap (Admin Only)
**Endpoint:** `POST /roadmaps`  
**Access:** Private (Admin)  
**Headers:** `Authorization: Bearer <token>`

### Update Roadmap (Admin Only)
**Endpoint:** `PUT /roadmaps/:id`  
**Access:** Private (Admin)

### Delete Roadmap (Admin Only)
**Endpoint:** `DELETE /roadmaps/:id`  
**Access:** Private (Admin)

---

## 💻 DSA Problems

### Get All Problems
Retrieve all DSA problems.

**Endpoint:** `GET /dsa-problems`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "arr_1",
      "categoryId": "arrays_strings",
      "categoryName": "Arrays & Strings",
      "title": "Two Sum",
      "difficulty": "easy",
      "tags": ["array", "hash-map"],
      "description": "Find two numbers that add up to target...",
      "concept": "Hash maps reduce lookup time...",
      "approaches": [...],
      "keyInsights": [...]
    }
  ]
}
```

### Get Problems by Category
Filter problems by category.

**Endpoint:** `GET /dsa-problems/category/:categoryId`  
**Access:** Public

**Example:** `GET /dsa-problems/category/arrays_strings`

### Get Problem by ID
**Endpoint:** `GET /dsa-problems/:id`  
**Access:** Public

### Create Problem (Admin Only)
**Endpoint:** `POST /dsa-problems`  
**Access:** Private (Admin)

### Update Problem (Admin Only)
**Endpoint:** `PUT /dsa-problems/:id`  
**Access:** Private (Admin)

### Delete Problem (Admin Only)
**Endpoint:** `DELETE /dsa-problems/:id`  
**Access:** Private (Admin)

---

## 📊 User Progress

All progress endpoints require authentication.

### Save Roadmap Progress
Save user progress for a specific roadmap.

**Endpoint:** `POST /progress/roadmap`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "roadmapId": "fullstack_roadmap",
  "completedItems": ["item_1", "item_2", "item_3"]
}
```

### Get Roadmap Progress
Get user progress for a specific roadmap.

**Endpoint:** `GET /progress/roadmap/:roadmapId`  
**Access:** Private

### Get All Roadmap Progress
Get all roadmap progress for logged-in user.

**Endpoint:** `GET /progress/roadmaps`  
**Access:** Private

### Toggle DSA Problem Solved
Mark a problem as solved or unsolved.

**Endpoint:** `POST /progress/dsa/toggle`  
**Access:** Private

**Request Body:**
```json
{
  "problemId": "arr_1",
  "isSolved": true
}
```

### Get DSA Progress
Get all solved problems for user.

**Endpoint:** `GET /progress/dsa`  
**Access:** Private

### Get DSA Statistics
Get user's DSA solving statistics.

**Endpoint:** `GET /progress/dsa/stats`  
**Access:** Private

**Success Response:**
```json
{
  "success": true,
  "data": {
    "total_solved": 45,
    "easy_solved": 20,
    "medium_solved": 20,
    "hard_solved": 5
  }
}
```

### Register for Event
Register user for an event.

**Endpoint:** `POST /progress/event/register`  
**Access:** Private

**Request Body:**
```json
{
  "eventId": "google_cloud_ai_labs"
}
```

### Get User Events
Get all events user is registered for.

**Endpoint:** `GET /progress/events`  
**Access:** Private

### Check Event Registration
Check if user is registered for specific event.

**Endpoint:** `GET /progress/event/:eventId/check`  
**Access:** Private

---

## 🚫 Error Codes

| Status | Meaning | Common Cause |
|--------|---------|--------------|
| **400** | Bad Request | Missing fields, invalid format |
| **401** | Unauthorized | Missing or invalid JWT token |
| **403** | Forbidden | Admin access required |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Database error, unexpected bug |

---

## 🔑 Authentication Header

For protected routes, include JWT token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Notes

- **Admin Routes**: Only users with `role: "admin"` can access admin-protected endpoints
- **JWT Expiry**: Tokens expire after 7 days
- **Pagination**: Currently not implemented (all endpoints return full datasets)
- **Rate Limiting**: Not implemented (recommended for production)
