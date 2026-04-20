import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', license_number: '', password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Create the customer record
      const customerRes = await API.post('/customers', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        license_number: form.license_number,
      });

      // Step 2: Create the user account linked to that customer
      await API.post('/auth/register', {
        email: form.email,
        password: form.password,
        customer_id: customerRes.data.customer_id,
        role: 'customer',
      });

      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>RevX <em>Rentals</em></h1>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subtitle}>Start earning rewards from day one</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Rahul Sharma' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'rahul@example.com' },
            { label: 'Phone', field: 'phone', type: 'text', placeholder: '9876543210' },
            { label: 'License Number', field: 'license_number', type: 'text', placeholder: 'KA05AB1234' },
            { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                style={styles.input}
                type={type}
                placeholder={placeholder}
                value={form[field]}
                onChange={update(field)}
                required
              />
            </div>
          ))}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '420px' },
  logo: { fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#94a3b8', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#cbd5e1' },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 16px', color: '#f8fafc', fontSize: '14px', outline: 'none' },
  btn: { background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' },
  link: { color: '#f97316', textDecoration: 'none', fontWeight: '600' },
};