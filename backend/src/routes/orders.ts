import express, { type Request, type Response } from 'express';
import type { Server } from 'socket.io';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import { auth } from '../middleware/auth.js';
import type { OrderStatus } from '../models/Order.js';

const router = express.Router();
const PROGRESS_STEPS: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

function scheduleOrderProgress(io: Server | undefined, orderId: string): void {
  let idx = 0;
  const interval = setInterval(async () => {
    idx += 1;
    if (idx >= PROGRESS_STEPS.length) {
      clearInterval(interval);
      return;
    }
    const order = await Order.findByIdAndUpdate(orderId, { status: PROGRESS_STEPS[idx] }, { new: true }).populate('restaurant', 'name image');
    if (order) io?.to(`order:${orderId}`).emit('order:updated', order);
  }, 8000);
}

router.post('/', auth, async (req: Request, res: Response) => {
  const { restaurantId, items, deliveryAddress } = req.body as {
    restaurantId: string;
    items: { menuItemId: string; name?: string; price?: number; quantity: number }[];
    deliveryAddress?: string;
  };
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404).json({ error: 'Restaurant not found' });
    return;
  }

  const orderItems = items.map((i) => {
    const m = restaurant.menu.find((item) => String(item._id) === String(i.menuItemId));
    return { menuItemId: i.menuItemId, name: m?.name || i.name, price: m?.price || i.price, quantity: i.quantity };
  });
  const subtotal = orderItems.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const deliveryFee = 2.99;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;

  const order = await Order.create({
    user: req.user!._id,
    restaurant: restaurantId,
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
    deliveryAddress: deliveryAddress || req.user!.address,
  });
  const populated = await order.populate('restaurant', 'name image');
  req.app.get('io')?.to(`order:${order._id}`).emit('order:updated', populated);
  req.app.get('io')?.emit('order:new', populated);
  scheduleOrderProgress(req.app.get('io'), String(order._id));
  res.status(201).json(populated);
});

router.get('/mine', auth, async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user!._id }).populate('restaurant', 'name image cuisine').sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', auth, async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user!._id }).populate('restaurant', 'name image');
  if (!order) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(order);
});

router.patch('/:id/status', auth, async (req: Request, res: Response) => {
  const statuses: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!statuses.includes(req.body.status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('restaurant', 'name');
  if (!order) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  req.app.get('io')?.to(`order:${order._id}`).emit('order:updated', order);
  res.json(order);
});

export default router;
