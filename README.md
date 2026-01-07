# Thrive - Task Management Application

A minimalistic web application for managing daily tasks and goals with a focus on habit tracking and progress visualization.

## Project Structure

```
Thrive/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Register, Login, Dashboard)
│   │   ├── context/       # React Context for state management
│   │   ├── services/      # API service calls
│   │   ├── App.tsx        # Main app with routing
│   │   └── index.css      # Global styles with Tailwind
│   └── package.json
│
└── server/                # Node.js Express backend
    ├── src/
    │   ├── controllers/    # Business logic
    │   │   ├── user/      # Authentication controllers
    │   │   └── goal/      # Goal/Task controllers
    │   ├── models/        # MongoDB schemas
    │   ├── routes/        # API route handlers
    │   ├── config/        # Configuration files
    │   ├── utils/         # Helper functions (encryption, hashing)
    │   ├── app.js         # Express app setup
    │   └── index.js       # Server entry point
    └── package.json
```

## Features

### Authentication
- User registration with email and password
- Login with session management
- HTTP-only cookies for security
- Logout functionality

### Task Management
- **Collections**: Organize tasks into different collections (goals)
- **Tasks**: Add/edit/delete tasks within collections
- **Habit Tracking**: Visual checkboxes to mark completed days
- **Targets**: Set target days for each task

### Dashboard
- View all tasks in current collection
- Mark task completions for specific days
- Auto-save completions after 2 seconds
- Hide or delete tasks
- Add new tasks on-the-fly
- Dropdown menu to switch between collections
- Create new collections
- Delete entire collections

### Security
- Encrypted email storage
- Hashed passwords with bcrypt
- Session-based authentication
- SHA-256 hashing for email lookup

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **Mongoose** for ODM
- **bcrypt** for password hashing
- **crypto** for encryption
- **express-session** for session management
- **dotenv** for environment variables

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Cloud or local)
- npm or yarn

### Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server root:
```env
PORT=3000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/Thrive?appName=Thrive-Data
ENCRYPTION_SECRET=<base64-encoded-32-byte-key>
SESSION_SECRET=your-session-secret-key
```

4. Generate an encryption key (run once):
```bash
node generateEncryptionKey.js
```

5. Start the server:
```bash
npm run dev
```

### Client Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port)

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user

### Goals
- `GET /api/goal/user/:userId` - Get all goals for user
- `POST /api/goal/create/:userId` - Create new goal with tasks
- `GET /api/goal/status/:goalId` - Get goal status and completions
- `POST /api/goal/add-task/:goalId` - Add task to goal
- `PUT /api/goal/edit/:goalId` - Edit goal details
- `DELETE /api/goal/:goalId` - Delete entire goal
- `DELETE /api/goal/delete-task/:goalId/:taskId` - Delete specific task
- `POST /api/goal/toggle-completed/:goalStatusId/:taskId` - Toggle task completion

## Usage Flow

1. **Register**: Create account with username, email, and password
2. **Login**: Sign in to access dashboard
3. **Dashboard**:
   - View default "My Task Collection" with sample task
   - Select collections from dropdown
   - Check boxes for days you completed each task
   - Use "..." menu to hide or delete tasks
   - Click "+ Add Task" to add new tasks
   - Use "+ Add New Collection" to create goals

## Component Architecture

### TaskRow
Displays a single task with:
- Task name and target days
- Day checkboxes (visual representation)
- Hide/Delete action buttons

### TitleDropdown
Dropdown menu for:
- Selecting existing collections
- Creating new collections
- Deleting collections

### AddTaskModal
Modal form to:
- Enter task name
- Set target days
- Add task to current collection

### CreateCollectionModal
Modal form to:
- Create new collection
- Add initial tasks
- Set description

## Data Models

### User
- Email (encrypted)
- Username (encrypted)
- Password (hashed)

### Goal (Collection)
- Title
- Description
- Tasks (array with auto-generated IDs)

### GoalStatus
- User reference
- Goal reference
- Month and Year
- Completed Tasks (with dates)

### Task
- Name
- Target Days
- Auto-generated unique ID

## Auto-save Feature

When marking a task as complete:
1. Checkbox updates immediately (optimistic UI)
2. 2-second delay before API call
3. Auto-saves completion date to database
4. Toggle removes date if already marked

## Security Considerations

- ✅ HTTPS-only cookies
- ✅ Encrypted email storage
- ✅ Hashed passwords with bcrypt
- ✅ SHA-256 email hashing for queries
- ✅ Session-based authentication
- ✅ CORS enabled with credentials

## Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] Social sharing of collections
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multiple language support
- [ ] Analytics dashboard
- [ ] Team collaboration features

## Troubleshooting

### Port already in use
- Frontend defaults to 5173, but will use next available port
- Backend defaults to 3000

### MongoDB connection error
- Verify MONGO_URL in .env
- Check IP whitelist in MongoDB Atlas
- Ensure database name is included in URL

### Encryption key error
- Run `node generateEncryptionKey.js` in server root
- Copy output to ENCRYPTION_SECRET in .env

### Session not persisting
- Check SESSION_SECRET is set in .env
- Verify credentials: 'include' in API calls
- Check browser cookie settings

## License

MIT
