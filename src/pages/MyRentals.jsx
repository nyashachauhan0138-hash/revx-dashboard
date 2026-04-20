import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MyRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const res = await API.get(`/rentals/customer/${user.customer_id}`);
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
      toast.success('Rental completed!');
      fetchRentals();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete rental');
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/rentals/${id}/cancel`);
      toast.success('Rental cancelled');
      fetchRentals();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel rental');
    }
  };

  const statusColor = { active: '#22d3ee', completed: '#22c55e', cancelled: '#ef4444' };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
          My Rentals
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          {rentals.length} total rental{rentals.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        ) : rentals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
            <p style={{ fontSize: '18px' }}>No rentals yet</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Browse cars to make your first booking</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rentals.map(rental => (
              <div key={rental.rental_id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                        Rental #{rental.rental_id}
                      </h3>
                      <span style={{
                        background: statusColor[rental.r_status] + '20',
                        color: statusColor[rental.r_status],
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {rental.r_status?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', color: '#94a3b8', fontSize: '14px' }}>
                      <span>📅 {rental.start_date?.slice(0, 10)} → {rental.end_date?.slice(0, 10)}</span>
                      <span>💰 ₹{rental.total_amount ?? '0.00'}</span>
                      {rental.discount_applied > 0 && (
                        <span style={{ color: '#22c55e' }}>🎉 ₹{rental.discount_applied} saved</span>
                      )}
                    </div>
                  </div>

                  {rental.r_status === 'active' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={completeBtn} onClick={() => handleComplete(rental.rental_id)}>
                        Complete
                      </button>
                      <button style={cancelBtn} onClick={() => handleCancel(rental.rental_id)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#1e293b', border: '1px solid #334155',
  borderRadius: '12px', padding: '24px',
};
const completeBtn = {
  background: '#22c55e', color: 'white', border: 'none',
  borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
  fontWeight: '600', cursor: 'pointer',
};
const cancelBtn = {
  background: 'transparent', color: '#ef4444',
  border: '1px solid #ef4444', borderRadius: '8px',
  padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
};