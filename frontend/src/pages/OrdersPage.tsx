import type { Order, OrderStatus } from '../types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'On the way', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { api<Order[]>('/orders/mine').then(setOrders).catch(console.error); }, []);

  return (
    <div className="app-shell">
      <nav className="nav"><Link to="/" className="logo">← Taste<span>Route</span></Link></nav>
      <h1 style={{ marginBottom: '1.5rem' }}>My orders</h1>
      {orders.length === 0 && <p style={{ color: 'var(--muted)' }}>No orders yet</p>}
      {orders.map((o) => (
        <Link key={o._id} to={`/track/${o._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="menu-item" style={{ marginBottom: '1rem' }}>
            <div>
              <strong>{o.restaurant?.name}</strong>
              <p style={{ color: 'var(--muted)' }}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600 }}>${o.total?.toFixed(2)}</p>
              <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{STATUS_LABELS[o.status]}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
