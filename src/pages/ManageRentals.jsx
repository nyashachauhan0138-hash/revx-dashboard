import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function ManageRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const res = await API.get('/rentals/active');
      setRentals(res.data);
    } catch {
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRentals(); }, []);

  const handleComplete = async (id) => {
    try {
      await API.put(`/rentals/${id}/complete`, { penalty_amount: 0 });
      toast.success(`Rental #${id} completed`);
      fetchRentals();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/rentals/${id}/cancel`);
      toast.success(`Rental #${id} cancelled`);
      fetchRentals();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
          Manage Rentals
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          {rentals.length} active rental{rentals.length !== 1 ? 's' : ''}
        </p>

        {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : rentals.length === 0 ? (
          <p style={{ color: '#64748b' }}>No active rentals at the moment</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rentals.map(r => (
              <div key={r.rental_id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
                      Rental #{r.rental_id}
                    </h3>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#94a3b8' }}>
                      <span>👤 {r.customer_name || `Customer #${r.customer_id}`}</span>
                      <span>🚗 {r.car_brand ? `${r.car_brand} ${r.car_model}` : `Car #${r.car_id}`}</span>
                      <span>📅 {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}</span>
                      <span style={{ color: '#f97316' }}>₹{r.total_cost ?? 'Pending'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={completeBtn} onClick={() => handleComplete(r.rental_id)}>Complete</button>
                    <button style={cancelBtn} onClick={() => handleCancel(r.rental_id)}>Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' };
const completeBtn = { background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const cancelBtn = { background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };