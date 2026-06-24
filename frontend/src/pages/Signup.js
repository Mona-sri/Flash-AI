import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ name:'', email:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())              return setError('Please enter your name.');
    if (!form.email.includes('@'))      return setError('Please enter a valid email.');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await signup(form.name.trim(), form.email.trim().toLowerCase(), form.password);
      navigate('/login');
    } catch(err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-icon">🚀</span>
        <h1>Create account</h1>
        <p className="subtitle">Start studying smarter with AI-generated flashcards</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input type="text" placeholder="Jane Doe" value={form.name}
              onChange={e => set('name', e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="jane@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={e => set('password', e.target.value)} />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input type="password" placeholder="Re-enter password" value={form.confirm}
              onChange={e => set('confirm', e.target.value)} />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading && <span className="mini-spinner" />}
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}