import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/servers', label: 'Quản lý Server', icon: '🖥️' },
  { to: '/rooms', label: 'Phòng Server', icon: '🏢' },
  { to: '/racks', label: 'Tủ Rack', icon: '🗄️' },
  { to: '/network-devices', label: 'Thiết bị mạng', icon: '🌐' },
  { to: '/equipment', label: 'Thiết bị phòng', icon: '🖱️' },
  { to: '/maintenance', label: 'Bảo trì', icon: '🔧' },
  { to: '/incidents', label: 'Sự cố', icon: '⚠️' },
  { to: '/reports', label: 'Báo cáo', icon: '📈' },
  { to: '/users', label: 'Tài khoản', icon: '👤', adminOnly: true },
  { to: '/logs', label: 'Nhật ký', icon: '📋', adminOnly: true },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span style={{ fontSize: '1.75rem' }}>🖧</span>
          <div>
            <h1>QL Server</h1>
            <span>Quản lý phòng server</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>{user?.fullName}</div>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem', width: '100%' }} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}
