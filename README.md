# AlgoHustle - Competitive Programming Progress Tracker

Track your competitive programming journey with real-time statistics from Codeforces and LeetCode.

## Features

- ✅ Real-time stats from Codeforces & LeetCode APIs
- ✅ JWT-based authentication
- ✅ Beautiful, responsive dashboard
- ✅ Rating progress charts
- ✅ Problem-solving statistics
- ✅ Server-side caching for better performance
- ✅ Rate limiting and security features

## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- Chart.js
- React Router
- Axios

### Backend
- Node.js + Express
- JWT Authentication
- Axios (API proxy)
- Node-cache (server-side caching)
- Rate limiting

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Option 1: Use Start Script (Easiest)

```bash
cd algohustle
./start.sh
```

This will:
1. Install dependencies for both frontend and backend
2. Start backend on `http://localhost:5000`
3. Start frontend on `http://localhost:5173`

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

### First Time Setup

1. Backend will run on: `http://localhost:5000`
2. Frontend will run on: `http://localhost:5173`
3. Open `http://localhost:5173` in your browser
4. Enter a Codeforces username (try "tourist" or "benq")
5. Click "Track My Progress"
6. Explore your dashboard!

## Project Structure

```
algohustle/
├── backend/              # Node.js + Express API
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── config/          # Database & config
│   └── server.js        # Main server file
│
├── Frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # API utilities
│   └── index.html
│
├── DEPLOYMENT.md        # Full deployment guide
└── start.sh            # Quick start script
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Codeforces/LeetCode username
- `POST /api/auth/verify` - Verify JWT token

### Profile
- `GET /api/profile/me` - Get current user profile
- `PUT /api/profile/me` - Update profile
- `GET /api/profile/:userId` - Get public profile

### Data
- `GET /api/cf/:handle` - Get Codeforces statistics
- `GET /api/lc/:handle` - Get LeetCode statistics
- `GET /api/cf/search/:handle` - Search Codeforces user

## Environment Variables

### Backend (backend/.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Frontend (Frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"codeforces":"tourist"}'

# Test Codeforces stats
curl http://localhost:5000/api/cf/tourist
```

### Test Frontend
1. Open http://localhost:5173
2. Try logging in with username "tourist"
3. Check if dashboard loads with real data
4. Open browser console (F12) to check for errors

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Render.com (FREE)
- Railway
- Vercel
- Heroku

Quick deployment summary:
1. Push code to GitHub
2. Deploy backend to Render/Railway
3. Deploy frontend to Vercel/Render
4. Update environment variables
5. Done!

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd Frontend
npm run dev  # Vite hot reload
```

### Build for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build  # Creates optimized build in dist/
npm run preview  # Preview production build
```

## Features Roadmap

- [x] Basic authentication
- [x] Codeforces integration
- [x] LeetCode integration
- [x] Dashboard with stats
- [x] Server-side caching
- [ ] Friends system
- [ ] Contest reminders
- [ ] Email notifications
- [ ] Firebase integration
- [ ] Mobile app

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists
- Run `npm install` in backend folder

### Frontend won't connect to backend
- Check `VITE_API_URL` in Frontend/.env
- Verify backend is running on port 5000
- Check browser console for CORS errors

### CORS errors
- Ensure backend CORS is configured correctly
- Check if frontend URL is whitelisted in backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Support

For issues or questions:
- Check DEPLOYMENT.md for common issues
- Open an issue on GitHub
- Check browser console & backend logs

## Author

Built with ❤️ by competitive programmers, for competitive programmers.

---

**Happy Coding! 🚀**
