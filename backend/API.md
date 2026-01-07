# Manabu Backend API Documentation

Base URL: `http://localhost:3333/api`

---

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nama User"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nama User"
    }
  }
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nama User",
      "currentLevel": "N5"
    }
  }
}
```

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nama User",
    "currentLevel": "N5",
    "streak": {
      "currentStreak": 7,
      "longestStreak": 14,
      "totalXp": 1250,
      "todayXp": 50,
      "todayLessons": 3
    }
  }
}
```

---

## Progress Tracking

### Get Overall Progress
```http
GET /progress
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "streak": {
      "currentStreak": 7,
      "totalXp": 1250,
      "todayXp": 50
    },
    "summary": {
      "vocab": { "learning": 15, "mastered": 30 },
      "kanji": { "learning": 5, "mastered": 10 },
      "grammar": { "learning": 3, "mastered": 5 },
      "kana": { "learning": 10, "mastered": 36 }
    },
    "totalItems": 114
  }
}
```

---

### Update Progress (After Quiz/Review)
```http
POST /progress/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemType": "vocab",    // vocab | kanji | grammar | kana
  "itemId": "v-n5-001",
  "level": "N5",
  "correct": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "xpGained": 10
  }
}
```

---

### Save Quiz Result
```http
POST /progress/quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizType": "vocab",    // vocab | kanji | kana
  "level": "N5",
  "score": 8,
  "totalQuestions": 10
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

### Get Streak Info
```http
GET /progress/streak
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 14,
    "totalXp": 1250,
    "todayXp": 50,
    "todayLessons": 3,
    "lastActiveDate": "2024-01-08"
  }
}
```

---

## Content API

### Get Vocabulary by Level
```http
GET /content/:level/vocab
```

**Example:** `GET /content/N5/vocab`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "word": "私",
      "reading": "わたし",
      "meaning": "saya; aku",
      "level": "N5",
      "exampleJapanese": "私は学生です。",
      "exampleReading": "わたしはがくせいです。",
      "exampleMeaning": "Saya adalah pelajar."
    }
  ]
}
```

---

### Get Kanji by Level
```http
GET /content/:level/kanji
```

**Example:** `GET /content/N5/kanji`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "character": "日",
      "onyomi": ["ニチ", "ジツ"],
      "kunyomi": ["ひ", "か"],
      "meaning": ["hari", "matahari", "Jepang"],
      "level": "N5",
      "examples": [
        { "word": "日曜日", "reading": "にちようび", "meaning": "Minggu" }
      ]
    }
  ]
}
```

---

### Get Grammar by Level
```http
GET /content/:level/grammar
```

**Example:** `GET /content/N5/grammar`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "pattern": "〜は〜です",
      "meaning": "A adalah B (sopan)",
      "usage": "Digunakan untuk mendeskripsikan atau mengidentifikasi sesuatu.",
      "level": "N5",
      "examples": [
        { "sentence": "私は学生です。", "meaning": "Saya adalah pelajar." }
      ]
    }
  ]
}
```

---

### Get Kana (Hiragana/Katakana)
```http
GET /content/kana/:type
```

**Example:** `GET /content/kana/hiragana`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "character": "あ", "romaji": "a", "row": "a" },
    { "character": "い", "romaji": "i", "row": "a" },
    { "character": "う", "romaji": "u", "row": "a" }
  ]
}
```

---

## Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-08T12:00:00.000Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Pesan error dalam Bahasa Indonesia"
}
```

**Common Error Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Data tidak lengkap atau tidak valid |
| 401 | Unauthorized - Token tidak ditemukan atau tidak valid |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Server Error - Kesalahan internal server |

---

## Frontend Integration Example

```typescript
const API_URL = 'http://localhost:3000/api';

// Login
const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// Get Vocab (with auth)
const getVocab = async (level: string, token: string) => {
  const res = await fetch(`${API_URL}/content/${level}/vocab`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

// Update Progress
const updateProgress = async (data: ProgressUpdate, token: string) => {
  const res = await fetch(`${API_URL}/progress/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
```
