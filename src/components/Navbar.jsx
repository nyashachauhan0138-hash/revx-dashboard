import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Car, LayoutDashboard, List } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} style={styles.logo}>
        RevX <em>Rentals</em>
      </Link>

      <div style={styles.links}>
        {user?.role === 'admin' ? (
          <>
            <Link to="/admin" style={styles.link}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/admin/rentals" style={styles.link}>
              <List size={16} /> Rentals
            </Link>
            <Link to="/cars" style={styles.link}>
              <Car size={16} /> Fleet
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={styles.link}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/cars" style={styles.link}>
              <Car size={16} /> Browse Cars
            </Link>
            <Link to="/my-rentals" style={styles.link}>
              <List size={16} /> My Rentals
            </Link>
          </>
        )}
      </div>

      <div style={styles.right}>
        <span style={styles.username}>{user?.email}</span>
        {user?.role === 'admin' && (
          <span style={styles.adminBadge}>Admin</span>
        )}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { fontSize: '20px', fontWeight: '700', color: '#f8fafc', textDecoration: 'none' },
  links: { display: 'flex', gap: '8px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '6px',
    color: '#94a3b8', textDecoration: 'none', padding: '8px 12px',
    borderRadius: '8px', fontSize: '14px', fontWeight: '500',
    transition: 'all 0.2s',
  },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  username: { fontSize: '13px', color: '#64748b' },
  adminBadge: {
    background: '#7c3aed', color: 'white',
    padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'transparent', border: '1px solid #475569',
    color: '#94a3b8', padding: '6px 12px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px',
  },
};