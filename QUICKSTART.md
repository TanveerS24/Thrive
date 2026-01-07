# Thrive - Quick Start Guide

## Setup in 5 Minutes

### 1. **Backend Setup**

```bash
cd server
npm install
```

Create `.env` file in `server/`:
```env
PORT=3000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/Thrive?appName=Thrive-Data
ENCRYPTION_SECRET=<your-32-byte-base64-key>
SESSION_SECRET=YourSecretKey123
```

Generate encryption key:
```bash
node generateEncryptionKey.js
```

Start backend:
```bash
npm run dev
```

Backend running at: `http://localhost:3000`

### 2. **Frontend Setup**

```bash
cd client
npm install
npm run dev
```

Frontend running at: `http://localhost:5173`

## Usage

### Register & Login
1. Go to `http://localhost:5173`
2. Click "Register here" to create account
3. Enter username, email, password
4. Redirect to login page
5. Enter email and password
6. Access dashboard

### Dashboard Features

**Collections (Goals)**
- Dropdown selector at top
- Create new collection with "+ Add New Collection"
- Delete collection via dropdown menu

**Tasks**
- View tasks in horizontal layout
- Check boxes = completed days
- Auto-saves after 2 seconds
- Hide or delete tasks with "..." menu
- Add new tasks with "+ Add Task" button

**Workflow**
1. Register → Login → Dashboard
2. See default "My Task Collection"
3. Check boxes for days completed
4. Create new collections
5. Add/delete tasks as needed
6. Logout when done

## Architecture

### Frontend (React + TypeScript)
- `components/` - Reusable UI pieces
- `pages/` - Full pages (Register, Login, Dashboard)
- `context/` - Auth state management
- `services/` - API calls
- `App.tsx` - Main routing

### Backend (Node + Express + MongoDB)
- `controllers/` - Business logic
- `models/` - Database schemas
- `routes/` - API endpoints
- `utils/` - Encryption & hashing

## API Endpoints

```
POST /api/user/register
POST /api/user/login
POST /api/user/logout

GET /api/goal/user/:userId
POST /api/goal/create/:userId
GET /api/goal/status/:goalId
POST /api/goal/add-task/:goalId
PUT /api/goal/edit/:goalId
POST /api/goal/toggle-completed/:goalStatusId/:taskId
DELETE /api/goal/delete-task/:goalId/:taskId
DELETE /api/goal/:goalId
```

## Troubleshooting

**Port 5173 in use?**
- Vite will use next available port (5174, etc.)

**MongoDB connection error?**
- Check MONGO_URL in .env
- Verify IP whitelist in MongoDB Atlas

**Encryption error?**
- Run `node generateEncryptionKey.js` in server
- Copy to ENCRYPTION_SECRET in .env

**Session not working?**
- Verify SESSION_SECRET is set
- Check browser allows cookies
- Clear browser cache/cookies

## Features Implemented

✅ User Registration & Login
✅ Session-based Authentication  
✅ Email Encryption
✅ Password Hashing
✅ Create Collections
✅ Add/Edit/Delete Tasks
✅ Mark Task Completions
✅ Auto-save (2-second delay)
✅ Hide/Delete Tasks
✅ Responsive UI
✅ Modular Code Structure

## Next Steps (Optional)

- Add profile page
- Email verification
- Password reset
- Social sharing
- Mobile app (React Native)
- Dark mode
- Analytics dashboard
- Team collaboration

---

**Questions?** Check `IMPLEMENTATION.md` for detailed architecture information.
