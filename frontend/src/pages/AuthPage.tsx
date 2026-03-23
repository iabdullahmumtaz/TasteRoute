import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo">Taste<span>Route</span></h1>
        <p style={{ color: 'var(--muted)', margin: '1rem 0' }}>Delicious food, delivered fast</p>
        {error && <p style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <div className="form-group"><label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Delivery address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </>
          )}
          <div className="form-group"><label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="form-group"><label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--muted)' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); }}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
}
