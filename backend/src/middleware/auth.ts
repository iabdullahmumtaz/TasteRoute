import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import type { IUserDocument } from '../models/User.js';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'dev-secret') as { id: string };
    req.user = (await User.findById(decoded.id).select('-password')) as IUserDocument | null ?? undefined;
    if (!req.user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
