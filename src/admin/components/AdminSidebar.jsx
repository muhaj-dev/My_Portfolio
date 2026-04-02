import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/abouts', label: 'About' },
  { to: '/admin/works', label: 'Works' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/experiences', label: 'Experiences' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/brands', label: 'Brands' },
  { to: '/admin/contacts', label: 'Contacts' },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2>Portfolio Admin</h2>
        <p>Content Management</p>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button onClick={handleLogout} className="admin-sidebar__logout">
          Sign Out
        </button>
        <NavLink to="/" className="admin-sidebar__link" style={{ marginTop: '0.5rem' }}>
          View Portfolio
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
