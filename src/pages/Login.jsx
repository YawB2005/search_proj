import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import './Login.css';

const API_URL = 'http://127.0.0.1:8000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user to local storage and redirect
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/', { state: { showWelcome: true } });
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Terminal className="brand-icon" size={32} />
          <h1>Sign in</h1>
          <p>Use your DSSearch Account</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="login-actions">
            <Link to="/" className="back-link">Back to search</Link>
            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? 'Signing in...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
