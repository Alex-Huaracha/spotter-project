import bcrypt from 'bcryptjs';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    req.login(newUser, (err) => {
      if (err) return next(err);
      // Return the user WITHOUT the password
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json({
        message: 'Registration successful',
        user: userWithoutPassword,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || 'Authentication error' });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      const { password, ...userWithoutPassword } = user;
      return res.json({
        message: 'Login successful',
        user: userWithoutPassword,
      });
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
};

export const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ isAuthenticated: true, user: userWithoutPassword });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
};
