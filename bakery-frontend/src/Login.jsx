import { useState } from 'react';
import api from './api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="Bakery administration">
        <div className="login-brand">
          <span className="login-brand__mark">Bakery</span>
          <span className="login-brand__sub">Admin</span>
        </div>
        <div className="login-copy">
          <p className="login-eyebrow">Daily baking, clearly managed</p>
          <h1>Good baking starts with a good morning.</h1>
          <p>Sign in to review today’s production, products, and sales.</p>
        </div>
        <p className="login-footer">Bakery administration</p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__heading">
            <p className="login-eyebrow">Welcome back</p>
            <h2>Sign in</h2>
            <p>Enter your account details to continue.</p>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <label className="login-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@bakery.com"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
