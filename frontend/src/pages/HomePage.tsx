import type { Order, Restaurant } from '../types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartDrawer from '../components/CartDrawer';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { api<Restaurant[]>('/restaurants').then(setRestaurants).catch(console.error); }, []);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="logo">Taste<span>Route</span></div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/orders">My orders</Link>
          <button className="btn-primary" onClick={() => setCartOpen(true)}>
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </nav>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hey {user?.name?.split(' ')[0]} 👋</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Order from top restaurants near you</p>
      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <Link key={r._id} to={`/restaurant/${r._id}`} className="restaurant-card">
            <img src={r.image} alt={r.name} />
            <div className="body">
              <h3>{r.name}</h3>
              <p style={{ color: 'var(--muted)' }}>{r.cuisine} · ★ {r.rating} · {r.deliveryTime}</p>
            </div>
          </Link>
        ))}
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
