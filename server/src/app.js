import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import express from 'express';
import cors from 'cors';
import goalRoutes from './routes/goal/goal.routes.js';


const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    name: "thrive.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,   // 🔒 JS can't access
      secure: false,    // true in production (HTTPS)
      sameSite: "lax",  // good default
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use('/api/goal', goalRoutes);

export default app;