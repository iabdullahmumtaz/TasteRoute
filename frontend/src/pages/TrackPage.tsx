import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../api/client';
import type { Order, OrderStatus } from '../types';

const STEPS: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const LABELS: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function socketUrl() {
  const base = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:6020';
  return base.replace(/\/api$/, '');
}

export default function TrackPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    api<Order>(`/orders/${id}`).then(setOrder).catch(console.error);
    const socket = io(socketUrl(), {
      auth: { token: localStorage.getItem('tasteroute_token') },
    });
    socket.emit('order:join', id);
    socket.on('order:updated', (o: Order) => {
      if (o._id === id) setOrder(o);
    });
    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (!order) return <div className="app-shell">Loading tracking...</div>;

  const stepIndex = STEPS.indexOf(order.status);
  const progress = Math.max(0, Math.min(100, ((stepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="app-shell">
      <nav className="nav"><Link to="/orders" className="logo">← Orders</Link></nav>
      <h1>Track order</h1>
      <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.5rem' }}>{order.restaurant?.name} · ${order.total?.toFixed(2)}</p>
      <div className="tracking-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
            {LABELS[s]}
          </div>
        ))}
      </div>
      <div className="delivery-map" style={{ marginTop: '1.5rem', borderRadius: 12, overflow: 'hidden', background: '#1a1a2e', height: 180, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)' }} />
        <div style={{ position: 'relative', padding: '1.25rem', color: 'white' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Delivery progress</p>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, marginTop: '0.75rem' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#e94560', borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            {order.status === 'delivered' ? 'Delivered!' : `Driver is ${(LABELS[order.status] || 'on the way').toLowerCase()}…`}
          </p>
        </div>
      </div>
      <div className="menu-item" style={{ marginTop: '1rem' }}>
        <p>Delivery to: <strong>{order.deliveryAddress || 'Your address'}</strong></p>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Items: {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}</p>
      </div>
    </div>
  );
}
