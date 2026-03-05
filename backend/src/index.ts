import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import orderRoutes from './routes/orders.js';
import { setupSocket } from './socket/index.js';
import Restaurant from './models/Restaurant.js';

const SEED_RESTAURANTS = [
  {
    name: 'Bella Italia', cuisine: 'Italian', rating: 4.8, deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    menu: [
      { name: 'Margherita Pizza', description: 'Fresh mozzarella & basil', price: 14.99, category: 'Pizza' },
      { name: 'Truffle Pasta', description: 'Creamy truffle sauce', price: 18.5, category: 'Pasta' },
    ],
  },
  {
    name: 'Tokyo Bento', cuisine: 'Japanese', rating: 4.7, deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
    menu: [
      { name: 'Salmon Roll', description: '8 pieces', price: 12.99, category: 'Sushi' },
      { name: 'Chicken Katsu', description: 'With rice & salad', price: 15.5, category: 'Mains' },
    ],
  },
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5020', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5020' }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'TasteRoute' }));
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

setupSocket(io);
app.set('io', io);

const PORT = process.env.PORT || 6020;

async function seedIfEmpty(): Promise<void> {
  const count = await Restaurant.countDocuments();
  if (count > 0) return;
  await Restaurant.insertMany(SEED_RESTAURANTS);
  console.log('[Seed] Demo restaurants created');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasteroute').then(async () => {
  await seedIfEmpty();
  server.listen(PORT, () => console.log(`TasteRoute API on :${PORT}`));
});
