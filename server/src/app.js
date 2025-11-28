import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from '../prisma/client.js';

import session from 'express-session';
import passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import './config/passport.js';
import authRoutes from './routes/auth.js';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTHENTICATION MIDDLEWARES
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Spotter API v1');
});

app.get('/api/feed', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, avatarUrl: true, gymGoals: true } },
        _count: { select: { likes: true, children: true } },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching the feed' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Muestra el error en tu terminal para que tú lo veas

  // Devuelve JSON al cliente
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error Interno del Servidor',
    // Solo mostramos el stack trace si no estamos en producción (seguridad)
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

export default app;
