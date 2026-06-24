import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/generate');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      login(email.trim().toLowerCase(), password);
      // navigate('/generate');
    } catch(err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-icon">👋</span>
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to access your decks</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="jane@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }} autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Your password" value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }} />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading && <span className="mini-spinner" />}
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up free</Link></p>
      </div>
    </div>
  );
}