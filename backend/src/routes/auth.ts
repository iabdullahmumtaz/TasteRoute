import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const sign = (u: { _id: unknown }) => jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, address } = req.body as { name: string; email: string; password: string; address?: string };
  if (await User.findOne({ email })) {
    res.status(400).json({ error: 'Email taken' });
    return;
  }
  const user = await User.create({ name, email, password, address });
  res.status(201).json({ token: sign(user), user: { id: user._id, name, email, address } });
});

router.post('/login', async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, address: user.address } });
});

router.get('/me', auth, (req: Request, res: Response) => {
  res.json({ user: { id: req.user!._id, name: req.user!.name, email: req.user!.email, address: req.user!.address } });
});

export default router;
