import 'dotenv/config';
import mongoose from 'mongoose';
import Restaurant from './models/Restaurant.js';

const restaurants = [
  {
    name: 'Bella Italia', cuisine: 'Italian', rating: 4.8, deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    menu: [
      { name: 'Margherita Pizza', description: 'Fresh mozzarella & basil', price: 14.99, category: 'Pizza' },
      { name: 'Truffle Pasta', description: 'Creamy truffle sauce', price: 18.5, category: 'Pasta' },
      { name: 'Tiramisu', description: 'Classic Italian dessert', price: 7.99, category: 'Dessert' },
    ],
  },
  {
    name: 'Tokyo Bento', cuisine: 'Japanese', rating: 4.7, deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
    menu: [
      { name: 'Salmon Roll', description: '8 pieces', price: 12.99, category: 'Sushi' },
      { name: 'Chicken Katsu', description: 'With rice & salad', price: 15.5, category: 'Mains' },
      { name: 'Miso Soup', description: 'Traditional', price: 4.5, category: 'Sides' },
    ],
  },
  {
    name: 'Green Bowl', cuisine: 'Healthy', rating: 4.6, deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    menu: [
      { name: 'Acai Bowl', description: 'Granola & berries', price: 11.99, category: 'Bowls' },
      { name: 'Quinoa Salad', description: 'Avocado & feta', price: 13.5, category: 'Salads' },
      { name: 'Green Smoothie', description: 'Spinach & mango', price: 6.99, category: 'Drinks' },
    ],
  },
];

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasteroute');
await Restaurant.deleteMany({});
await Restaurant.insertMany(restaurants);
console.log('Seeded', restaurants.length, 'restaurants');
process.exit(0);
