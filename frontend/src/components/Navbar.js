import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/generate')}>
        <span className="brand-icon">⚡</span>
        <span className="brand-text">FlashAI</span>
      </div>

      <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        <span className={open ? 'bar open1' : 'bar'} />
        <span className={open ? 'bar open2' : 'bar'} />
        <span className={open ? 'bar open3' : 'bar'} />
      </button>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        <NavLink to="/generate" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
          ✦ Generate
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
          🗂 Saved Decks
        </NavLink>
        <div className="nav-divider" />
        <div className="nav-user">
          <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <span className="user-name">{user.name}</span>
        </div>
        <button className="btn-logout" onClick={() => { logout(); navigate('/'); setOpen(false); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}