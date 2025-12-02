import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from '../prisma/client.js';
import session from 'express-session';
import passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import './config/passport.js';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { globalErrorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication Middlewares
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Check expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Enables persistent sessions

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Spotter API v1');
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
