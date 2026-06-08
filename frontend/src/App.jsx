import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Rooms from './pages/Rooms';
import Racks from './pages/Racks';
import NetworkDevices from './pages/NetworkDevices';
import Maintenance from './pages/Maintenance';
import Incidents from './pages/Incidents';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Logs from './pages/Logs';
import Equipment from './pages/Equipment';
import Workshops from './pages/Workshops';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="servers" element={<Servers />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="racks" element={<Racks />} />
        <Route path="network-devices" element={<NetworkDevices />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="workshops" element={<ProtectedRoute adminOnly><Workshops /></ProtectedRoute>} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        <Route path="logs" element={<ProtectedRoute adminOnly><Logs /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
