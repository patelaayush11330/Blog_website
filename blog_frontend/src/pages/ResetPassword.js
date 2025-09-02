import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus({ loading: false, error: 'Password must be at least 8 characters.', success: '' });
      return;
    }
    if (password !== confirm) {
      setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
      return;
    }
    setStatus({ loading: true, error: '', success: '' });

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setStatus({ loading: false, error: '', success: 'Password reset successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Reset Password</h2>
        {/* New Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            tabIndex={-1}
            onClick={() => setShowConfirm((prev) => !prev)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={status.loading}
        >
          {status.loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {status.error && <div className="mt-4 text-red-600">{status.error}</div>}
        {status.success && <div className="mt-4 text-green-600">{status.success}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
