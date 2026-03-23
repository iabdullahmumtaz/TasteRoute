import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import OrdersPage from './pages/OrdersPage';
import TrackPage from './pages/TrackPage';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
      <Route path="/restaurant/:id" element={user ? <RestaurantPage /> : <Navigate to="/auth" />} />
      <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/auth" />} />
      <Route path="/track/:id" element={user ? <TrackPage /> : <Navigate to="/auth" />} />
    </Routes>
  );
}
