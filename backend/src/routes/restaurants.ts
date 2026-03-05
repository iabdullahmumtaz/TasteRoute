import express, { type Request, type Response } from 'express';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  const list = await Restaurant.find().select('-menu').sort({ rating: -1 });
  res.json(list);
});

router.get('/:id', async (req: Request, res: Response) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(r);
});

export default router;
