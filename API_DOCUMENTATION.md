# 🔌 Event Management API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📋 Public Endpoints

### Events

#### Get All Events
```http
GET /api/events
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category ID |
| type | string | Filter by event type (individual/team) |
| status | string | Filter by status (upcoming/live/past/completed) |
| isPaid | boolean | Filter by payment (true/false) |
| mode | string | Filter by mode (online/offline/hybrid) |
| search | string | Search by title or description |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Hackathon 2024",
        "slug": "hackathon-2024",
        "description": "...",
        "category": {
          "id": "uuid",
          "name": "Coding & Tech",
          "slug": "coding-tech"
        },
        "eventType": "team",
        "mode": "online",
        "isTeamEvent": true,
        "allowIndividual": false,
        "minTeamSize": 2,
        "maxTeamSize": 4,
        "isPaid": true,
        "registrationFee": 500,
        "currency": "INR",
        "registrationStart": "2024-01-20T00:00:00Z",
        "registrationEnd": "2024-01-30T23:59:59Z",
        "eventStart": "2024-02-01T09:00:00Z",
        "eventEnd": "2024-02-02T18:00:00Z",
        "hasSubmission": true,
        "status": "published",
        "isFeatured": true,
        "bannerImage": "https://...",
        "participantCount": 150,
        "teamCount": 40,
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

#### Get Event by ID
```http
GET /api/events/:eventId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "title": "Hackathon 2024",
      // ... all event fields
      "category": { /* category object */ },
      "creator": {
        "id": "uuid",
        "fullName": "Admin User"
      },
      "registrationCount": 150,
      "teamCount": 40,
      "submissionCount": 35,
      // If user is authenticated:
      "currentUserRegistration": {
        "id": "uuid",
        "status": "confirmed",
        "paymentStatus": "completed",
        "participationType": "team",
        "team": { /* team object */ }
      }
    }
  }
}
```

#### Get Event Teams
```http
GET /api/events/:eventId/teams
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (incomplete/complete/registered) |

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "uuid",
        "teamName": "Code Warriors",
        "leader": {
          "id": "uuid",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "memberCount": 3,
        "isComplete": true,
        "isLocked": false,
        "isRegistered": true
      }
    ]
  }
}
```

---

## 🔐 Protected Endpoints (User)

### Registration

#### Register for Event
```http
POST /api/events/:eventId/register
```

**Request Body:**
```json
{
  "participationType": "individual" // or "team"
  // If team:
  "teamId": "uuid" // optional, if joining existing team
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registration": {
      "id": "uuid",
      "eventId": "uuid",
      "userId": "uuid",
      "participationType": "individual",
      "status": "confirmed",
      "paymentStatus": "n/a", // or "pending" if paid event
      "registeredAt": "2024-01-20T10:00:00Z"
    },
    // If paid event:
    "payment": {
      "orderId": "order_razorpay123",
      "amount": 50000, // in paise
      "currency": "INR"
    }
  }
}
```

#### Get My Registrations
```http
GET /api/users/me/registrations
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by event status (upcoming/live/past) |

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "uuid",
        "event": {
          "id": "uuid",
          "title": "Hackathon 2024",
          "eventStart": "2024-02-01T09:00:00Z",
          "status": "upcoming"
        },
        "participationType": "team",
        "team": {
          "id": "uuid",
          "teamName": "Code Warriors"
        },
        "paymentStatus": "completed",
        "status": "confirmed",
        "registeredAt": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

#### Cancel Registration
```http
DELETE /api/events/:eventId/register
```

**Response:**
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

---

### Teams

#### Create Team
```http
POST /api/teams/create
```

**Request Body:**
```json
{
  "eventId": "uuid",
  "teamName": "Code Warriors"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team": {
      "id": "uuid",
      "eventId": "uuid",
      "teamName": "Code Warriors",
      "teamLeaderId": "uuid",
      "isComplete": false,
      "members": [
        {
          "id": "uuid",
          "user": {
            "id": "uuid",
            "fullName": "John Doe",
            "email": "john@example.com"
          },
          "isLeader": true
        }
      ],
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### Invite User to Team
```http
POST /api/teams/:teamId/invite
```

**Request Body:**
```json
{
  "userId": "uuid",
  "message": "Join our awesome team!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "uuid",
      "teamId": "uuid",
      "userId": "uuid",
      "requestType": "received",
      "status": "pending",
      "message": "Join our awesome team!",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### Request to Join Team
```http
POST /api/teams/:teamId/request-join
```

**Request Body:**
```json
{
  "message": "I'd like to join your team" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "uuid",
      "teamId": "uuid",
      "userId": "uuid",
      "requestType": "sent",
      "status": "pending",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### Respond to Team Request
```http
PATCH /api/teams/:teamId/respond-request
```

**Request Body:**
```json
{
  "requestId": "uuid",
  "action": "accept", // or "reject"
  "responseMessage": "Welcome to the team!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "uuid",
      "status": "accepted",
      "respondedAt": "2024-01-20T11:00:00Z"
    },
    // If accepted:
    "teamMember": {
      "id": "uuid",
      "teamId": "uuid",
      "userId": "uuid",
      "isLeader": false,
      "joinedAt": "2024-01-20T11:00:00Z"
    }
  }
}
```

#### Get Team Details
```http
GET /api/teams/:teamId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team": {
      "id": "uuid",
      "eventId": "uuid",
      "teamName": "Code Warriors",
      "event": {
        "id": "uuid",
        "title": "Hackathon 2024",
        "minTeamSize": 2,
        "maxTeamSize": 4,
        "teamFormationDeadline": "2024-01-30T23:59:59Z"
      },
      "leader": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "id": "uuid",
          "user": {
            "id": "uuid",
            "fullName": "John Doe",
            "email": "john@example.com"
          },
          "isLeader": true,
          "joinedAt": "2024-01-20T10:00:00Z"
        }
      ],
      "memberCount": 3,
      "isComplete": true,
      "isLocked": false,
      "isRegistered": false
    }
  }
}
```

#### Get Team Requests
```http
GET /api/teams/:teamId/requests
```

**Response:**
```json
{
  "success": true,
  "data": {
    "received": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "fullName": "Jane Smith",
          "email": "jane@example.com"
        },
        "requestType": "sent",
        "status": "pending",
        "message": "I'd like to join",
        "createdAt": "2024-01-20T12:00:00Z"
      }
    ],
    "sent": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "fullName": "Bob Wilson",
          "email": "bob@example.com"
        },
        "requestType": "received",
        "status": "pending",
        "message": "Join us!",
        "createdAt": "2024-01-20T11:30:00Z"
      }
    ]
  }
}
```

#### Delete Team
```http
DELETE /api/teams/:teamId
```

**Response:**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

#### Leave Team
```http
POST /api/teams/:teamId/leave
```

**Response:**
```json
{
  "success": true,
  "message": "Left team successfully"
}
```

#### Get My Teams
```http
GET /api/users/me/teams
```

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "uuid",
        "teamName": "Code Warriors",
        "event": {
          "id": "uuid",
          "title": "Hackathon 2024"
        },
        "memberCount": 3,
        "isLeader": true,
        "isComplete": true,
        "isRegistered": true
      }
    ]
  }
}
```

---

### Submissions

#### Submit Project
```http
POST /api/events/:eventId/submit
```

**Request Body (multipart/form-data):**
```
projectDeck: File (PDF, max 5MB)
mvpLink: string (URL)
demoVideoUrl: string (YouTube/Vimeo URL)
githubRepoUrl: string (GitHub URL)
technologiesUsed: string (max 256 chars)
aiToolsIntegrated: string (max 256 chars)
solutionDescription: string (max 1000 chars)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "eventId": "uuid",
      "userId": "uuid",
      "teamId": "uuid",
      "projectDeckUrl": "https://s3.../deck.pdf",
      "mvpLink": "https://my-app.com",
      "demoVideoUrl": "https://youtube.com/watch?v=...",
      "githubRepoUrl": "https://github.com/user/repo",
      "technologiesUsed": "React, Node.js, MongoDB",
      "aiToolsIntegrated": "OpenAI GPT-4, TensorFlow",
      "solutionDescription": "Our solution...",
      "status": "submitted",
      "submittedAt": "2024-02-02T16:00:00Z"
    }
  }
}
```

#### Update Submission
```http
PUT /api/events/:eventId/submission
```

**Request Body:** (same as submit)

**Response:** (same as submit)

#### Get My Submission
```http
GET /api/events/:eventId/submission
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      // ... all submission fields
      "score": 85.5,
      "rank": 5,
      "feedback": "Great work! Very innovative solution.",
      "status": "evaluated",
      "evaluatedAt": "2024-02-05T10:00:00Z"
    }
  }
}
```

---

### Payments

#### Create Payment Order
```http
POST /api/payments/create-order
```

**Request Body:**
```json
{
  "eventId": "uuid",
  "teamId": "uuid" // optional, for team events
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_razorpay123",
    "amount": 50000, // in paise (₹500)
    "currency": "INR",
    "eventTitle": "Hackathon 2024",
    "keyId": "rzp_test_xxx"
  }
}
```

#### Verify Payment
```http
POST /api/payments/verify
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay123",
  "razorpay_payment_id": "pay_razorpay456",
  "razorpay_signature": "signature_hash",
  "eventId": "uuid",
  "teamId": "uuid" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registration": {
      "id": "uuid",
      "status": "confirmed",
      "paymentStatus": "completed",
      "paymentId": "pay_razorpay456",
      "amountPaid": 500,
      "paidAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

---

## 🔐 Admin Endpoints

### Event Management

#### Create Event
```http
POST /api/admin/events
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Hackathon 2024",
  "description": "Annual hackathon...",
  "categoryId": "uuid",
  "eventType": "team",
  "mode": "online",
  "registrationStart": "2024-01-20T00:00:00Z",
  "registrationEnd": "2024-01-30T23:59:59Z",
  "eventStart": "2024-02-01T09:00:00Z",
  "eventEnd": "2024-02-02T18:00:00Z",
  "isTeamEvent": true,
  "allowIndividual": false,
  "minTeamSize": 2,
  "maxTeamSize": 4,
  "teamFormationDeadline": "2024-01-28T23:59:59Z",
  "isPaid": true,
  "registrationFee": 500,
  "hasSubmission": true,
  "submissionStart": "2024-02-01T09:00:00Z",
  "submissionDeadline": "2024-02-02T18:00:00Z",
  "rules": "1. Follow code of conduct...",
  "eligibility": "Open to all students",
  "prizes": {
    "first": "₹50,000",
    "second": "₹30,000",
    "third": "₹20,000"
  },
  "status": "draft" // or "published"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "slug": "hackathon-2024",
      // ... all event fields
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

#### Update Event
```http
PUT /api/admin/events/:eventId
Authorization: Bearer <admin_token>
```

**Request Body:** (same fields as create, all optional)

**Response:** (same as create)

#### Delete Event
```http
DELETE /api/admin/events/:eventId
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### Get Event Participants
```http
GET /api/admin/events/:eventId/participants
Authorization: Bearer <admin_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| paymentStatus | string | Filter by payment status |
| participationType | string | Filter by type (individual/team) |
| page | number | Page number |
| limit | number | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "participants": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "participationType": "team",
        "team": {
          "id": "uuid",
          "teamName": "Code Warriors"
        },
        "paymentStatus": "completed",
        "amountPaid": 500,
        "status": "confirmed",
        "registeredAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 15,
      "limit": 10
    }
  }
}
```

#### Get Event Teams
```http
GET /api/admin/events/:eventId/teams
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "uuid",
        "teamName": "Code Warriors",
        "leader": {
          "id": "uuid",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "members": [
          {
            "user": {
              "fullName": "John Doe",
              "email": "john@example.com"
            },
            "isLeader": true
          }
        ],
        "memberCount": 3,
        "isRegistered": true,
        "registeredAt": "2024-01-22T10:00:00Z"
      }
    ]
  }
}
```

---

### Submission Management

#### Get Event Submissions
```http
GET /api/admin/events/:eventId/submissions
Authorization: Bearer <admin_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (submitted/evaluated) |
| page | number | Page number |
| limit | number | Items per page |
| sortBy | string | Sort by field (score/submittedAt) |
| order | string | Sort order (asc/desc) |

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "user": {
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "team": {
          "teamName": "Code Warriors"
        },
        "projectDeckUrl": "https://...",
        "mvpLink": "https://...",
        "demoVideoUrl": "https://...",
        "githubRepoUrl": "https://...",
        "technologiesUsed": "React, Node.js",
        "aiToolsIntegrated": "OpenAI GPT-4",
        "solutionDescription": "...",
        "score": 85.5,
        "rank": 5,
        "feedback": "Great work!",
        "status": "evaluated",
        "submittedAt": "2024-02-02T16:00:00Z",
        "evaluatedAt": "2024-02-05T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 35,
      "page": 1,
      "pages": 4,
      "limit": 10
    }
  }
}
```

#### Evaluate Submission
```http
PATCH /api/admin/submissions/:submissionId/evaluate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "score": 85.5,
  "feedback": "Great work! Very innovative solution. Some areas for improvement..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "score": 85.5,
      "rank": 5,
      "feedback": "Great work!...",
      "status": "evaluated",
      "evaluatedAt": "2024-02-05T10:00:00Z"
    }
  }
}
```

#### Publish Results
```http
POST /api/admin/events/:eventId/publish-results
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "winners": [
    {
      "position": 1,
      "submissionId": "uuid"
    },
    {
      "position": 2,
      "submissionId": "uuid"
    },
    {
      "position": 3,
      "submissionId": "uuid"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      "status": "completed",
      "winners": [
        {
          "position": 1,
          "team": {
            "teamName": "Code Warriors"
          },
          "score": 95,
          "prize": "₹50,000"
        }
      ]
    }
  }
}
```

---

### Analytics

#### Get Dashboard Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEvents": 45,
      "totalUsers": 1250,
      "totalRegistrations": 3450,
      "totalRevenue": 245000
    },
    "monthly": {
      "events": 5,
      "users": 120,
      "registrations": 450,
      "revenue": 50000
    },
    "recentActivity": [
      {
        "type": "registration",
        "user": "John Doe",
        "event": "Hackathon 2024",
        "timestamp": "2024-01-23T10:00:00Z"
      }
    ]
  }
}
```

#### Get Event-wise Analytics
```http
GET /api/admin/analytics/events
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Hackathon 2024",
        "date": "2024-02-01",
        "participantCount": 150,
        "teamCount": 40,
        "submissionCount": 35,
        "revenue": 75000,
        "status": "completed"
      }
    ]
  }
}
```

#### Export Analytics
```http
GET /api/admin/analytics/export
Authorization: Bearer <admin_token>
```

**Response:** CSV file download

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // optional, validation errors
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `CONFLICT` (409) - e.g., already registered
- `SERVER_ERROR` (500)

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "teamSize": "Must be between 2 and 4"
      }
    }
  }
}
```

---

## 🔄 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

**API Version:** 1.0  
**Last Updated:** 2026-01-23
