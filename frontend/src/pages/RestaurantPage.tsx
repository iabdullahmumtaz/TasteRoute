import type { Restaurant } from '../types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../hooks/useCart';
import CartDrawer from '../components/CartDrawer';

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, items } = useCart();

  useEffect(() => { if (id) api<Restaurant>(`/restaurants/${id}`).then(setRestaurant).catch(console.error); }, [id]);

  if (!restaurant) return <div className="app-shell">Loading...</div>;

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="app-shell">
      <nav className="nav">
        <Link to="/" className="logo">← Taste<span>Route</span></Link>
        <button className="btn-primary" onClick={() => setCartOpen(true)}>
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>
      <img src={restaurant.image} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 16, marginBottom: '1rem' }} />
      <h1>{restaurant.name}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{restaurant.cuisine} · ★ {restaurant.rating}</p>
      {restaurant.menu?.map((item) => (
        <div key={item._id} className="menu-item">
          <div>
            <strong>{item.name}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{item.description}</p>
            <p style={{ color: 'var(--accent)', fontWeight: 600, marginTop: '0.25rem' }}>${item.price.toFixed(2)}</p>
          </div>
          <button className="btn-primary" onClick={() => addItem(restaurant, item)}>Add</button>
        </div>
      ))}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
