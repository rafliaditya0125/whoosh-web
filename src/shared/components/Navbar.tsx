import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/tickets', label: 'My Tickets' },
  { path: '/profile', label: 'Profile' },
];

const Navbar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <header>
      <Link to="/">Whoosh</Link>
      <nav>
        {NAV_ITEMS.map(({ path, label }) => (
          <Link key={path} to={path}>{label}</Link>
        ))}
      </nav>
      <div>
        {user ? (
          <div>
            <span>{user.full_name}</span>
            <span>{user.role}</span>
            <button onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
