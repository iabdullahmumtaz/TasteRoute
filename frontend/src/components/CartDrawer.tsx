import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { api } from '../api/client';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, restaurantId, restaurantName, subtotal, updateQty, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const checkout = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      const order = await api<{ _id: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify({ restaurantId, items, deliveryAddress: address }),
      });
      clear();
      onClose();
      navigate(`/track/${order._id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} onClick={onClose} />}
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <h2 style={{ marginBottom: '0.5rem' }}>Your cart</h2>
        {restaurantName && <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{restaurantName}</p>}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.length === 0 && <p style={{ color: 'var(--muted)' }}>Cart is empty</p>}
          {items.map((i) => (
            <div key={i.menuItemId} className="menu-item" style={{ marginBottom: '0.5rem' }}>
              <div>
                <strong>{i.name}</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>${i.price.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn-ghost" style={{ padding: '0.25rem 0.6rem' }} onClick={() => updateQty(i.menuItemId, -1)}>−</button>
                <span>{i.quantity}</span>
                <button className="btn-ghost" style={{ padding: '0.25rem 0.6rem' }} onClick={() => updateQty(i.menuItemId, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
              <strong>${(subtotal + 2.99).toFixed(2)}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}> incl. delivery</span>
            </p>
            <div className="form-group">
              <label>Delivery address</label>
              <input placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={checkout} disabled={loading}>
              Place order
            </button>
          </>
        )}
      </div>
    </>
  );
}
