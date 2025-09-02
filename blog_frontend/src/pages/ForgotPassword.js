import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setStatus({ loading: false, error: '', success: 'Password reset link sent to your email.' });
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
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Forgot Password?</h2>
        <p className="mb-6 text-gray-600">Enter your registered email address. We'll send you a link to reset your password.</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={status.loading}
        >
          {status.loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {status.error && <div className="mt-4 text-red-600">{status.error}</div>}
        {status.success && <div className="mt-4 text-green-600">{status.success}</div>}
      </form>
    </div>
  );
};

export default ForgotPassword;
