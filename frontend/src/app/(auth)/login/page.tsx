'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to track your health journey</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 200px);
        }
        .auth-card {
          width: 100%;
          max-width: 450px;
          text-align: center;
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .subtitle {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
        .btn.full-width {
          width: 100%;
          margin-top: 1rem;
        }
        .error-message {
          background: rgba(214, 48, 49, 0.1);
          color: var(--error);
          padding: 0.8rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .auth-footer {
          margin-top: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
