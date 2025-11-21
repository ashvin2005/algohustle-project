# AlgoHustle Backend API

Backend server for AlgoHustle - a competitive programming progress tracker.

## Features

- JWT-based authentication
- Codeforces & LeetCode API proxying
- Server-side caching to reduce API calls
- Rate limiting for security
- In-memory database (easily replaceable with Firebase/MongoDB)

## Tech Stack

- Node.js + Express
- JWT for authentication
- Axios for API calls
- node-cache for caching
- Firebase Admin SDK support (optional)

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file (already created with defaults):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with Codeforces/LeetCode username

**Request:**
```json
{
  "codeforces": "tourist",
  "leetcode": "username"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "tourist",
    "codeforces": "tourist",
    "leetcode": null,
    "displayName": "tourist",
    "createdAt": "2025-11-21T..."
  }
}
```

#### POST /api/auth/verify
Verify JWT token

**Headers:**
```
Authorization: Bearer <token>
```

### Profile

#### GET /api/profile/me
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/profile/me
Update user profile (requires authentication)

**Request:**
```json
{
  "displayName": "New Name"
}
```

#### GET /api/profile/:userId
Get public user profile

### Data APIs

#### GET /api/cf/:handle
Get Codeforces user statistics

**Response:**
```json
{
  "rating": 3700,
  "maxRating": 3700,
  "rank": "Legendary Grandmaster",
  "problemsSolved": 2000,
  "submissions": 5000,
  "ratingHistory": [...]
}
```

#### GET /api/lc/:handle
Get LeetCode user statistics

#### GET /api/cf/search/:handle
Search for Codeforces user

## Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Set environment variables in Railway dashboard

### Deploy to Render

1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

### Deploy to Heroku

1. Install Heroku CLI and login
```bash
heroku login
heroku create algohustle-api
git push heroku main
```

2. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
```

## Security Notes

- Change JWT_SECRET in production
- Enable CORS only for your frontend domain
- Use HTTPS in production
- Add rate limiting (already included)
- Consider using Firebase/MongoDB for persistent storage

## Testing

Test the API:

```bash
# Health check
curl http://localhost:5000/

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"codeforces":"tourist"}'

# Get Codeforces stats
curl http://localhost:5000/api/cf/tourist
```
