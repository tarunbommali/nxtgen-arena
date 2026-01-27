# 30-Day Challenge Progress Schema

## Database Schema

### 1. User Challenge Registration
```javascript
// Collection: userChallengeRegistrations
{
  id: string, // auto-generated
  userId: string, // Firebase Auth UID
  challengeId: string, // e.g., "git-mastery"
  registeredAt: timestamp,
  status: "active" | "completed" | "paused",
  currentDay: number, // 1-30, represents the next unlocked day
  completedDays: number[], // array of completed day numbers
  lastActivityAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. Daily Progress Tracking
```javascript
// Collection: userDayProgress
{
  id: string, // auto-generated
  userId: string,
  challengeId: string,
  dayNumber: number, // 1-30
  status: "locked" | "unlocked" | "in_progress" | "completed",
  unlockedAt: timestamp | null,
  startedAt: timestamp | null,
  completedAt: timestamp | null,
  submissionData: {
    type: "text" | "code" | "screenshot" | "diagram",
    content: string,
    submittedAt: timestamp
  } | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. Challenge Metadata
```javascript
// Collection: challenges (existing structure enhanced)
{
  id: string,
  title: string,
  description: string,
  category: string,
  difficulty: string,
  totalDays: number,
  unlockPattern: "sequential", // future: "weekly", "custom"
  prerequisites: string[],
  // ... existing fields
}
```

## Frontend State Management

### Challenge Progress State
```javascript
const challengeProgressState = {
  registration: {
    isRegistered: boolean,
    registeredAt: timestamp,
    currentDay: number,
    status: string
  },
  dayProgress: {
    [dayNumber]: {
      status: "locked" | "unlocked" | "in_progress" | "completed",
      unlockedAt: timestamp,
      completedAt: timestamp,
      canAccess: boolean
    }
  },
  statistics: {
    totalDays: number,
    completedDays: number,
    currentStreak: number,
    completionPercentage: number
  }
}
```

## API Endpoints

### Registration
- `POST /api/challenges/{challengeId}/register` - Register for challenge
- `GET /api/challenges/{challengeId}/registration` - Get registration status

### Progress Tracking
- `GET /api/challenges/{challengeId}/progress` - Get user progress
- `POST /api/challenges/{challengeId}/days/{dayNumber}/complete` - Mark day complete
- `PUT /api/challenges/{challengeId}/days/{dayNumber}/submission` - Submit day work

### Day Access Control
- `GET /api/challenges/{challengeId}/days/{dayNumber}/access` - Check day access
- `POST /api/challenges/{challengeId}/days/{dayNumber}/unlock` - Unlock next day

## Business Logic

### Day Unlock Rules
1. **Day 1**: Unlocked immediately upon registration
2. **Day 2-30**: Unlocked only after previous day completion
3. **Completion Criteria**: Must submit required work for the day
4. **Sequential Access**: Cannot skip days or access future days

### Progress Validation
1. **Server-side validation** for all progress updates
2. **Timestamp verification** to prevent cheating
3. **Submission validation** based on day requirements
4. **Automatic unlock** of next day upon completion