import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await API.post('/auth/reset-password', {
        email,
        newPassword: password,
      });

      toast.success('Password reset successful!');
      navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}