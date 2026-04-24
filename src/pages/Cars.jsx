import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Cars() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingCar, setBookingCar] = useState(null);
  const [form, setForm] = useState({ start_date: '', end_date: '', points_to_redeem: 0 });

  const today = new Date().toISOString().split('T')[0];
  const sixMonthsLater = new Date(new Date().setMonth(new Date().getMonth() + 6))
    .toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, loyaltyRes] = await Promise.all([
          API.get('/cars/available'),
          API.get(`/customers/${user.customer_id}/loyalty`),
        ]);
        setCars(carsRes.data);
        setLoyalty({ points: loyaltyRes.data.loyalty_points });
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBook = async () => {
    if (!form.start_date || !form.end_date) {
      return toast.error('Please select start and end dates');
    }
    try {
      await API.post('/rentals', {
        customer_id: user.customer_id,
        car_id: bookingCar.car_id,
        start_date: form.start_date,
        end_date: form.end_date,
        points_to_redeem: form.points_to_redeem || 0,
      });
      toast.success('Car booked successfully!');
      setBookingCar(null);
      setForm({ start_date: '', end_date: '', points_to_redeem: 0 });
      const res = await API.get('/cars/available');
      setCars(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
          Available Cars
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          {cars.length} car{cars.length !== 1 ? 's' : ''} available for rental
        </p>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {cars.map(car => (
              <div key={car.car_id} style={cardStyle}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {car.category}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', margin: '6px 0' }}>
                    {car.model}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: 'Category', value: car.category },
                    { label: 'Per Day', value: `₹${car.base_price_per_day}` },
                    { label: 'Status', value: car.c_status },
                  ].map((item, i) => (
                    <div key={i} style={statBox}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <button style={btnStyle} onClick={() => setBookingCar(car)}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {bookingCar && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
                Book {bookingCar.model}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
                ₹{bookingCar.base_price_per_day} per day
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.start_date}
                    min={today}
                    max={sixMonthsLater}
                    onChange={e => setForm({ ...form, start_date: e.target.value, end_date: '' })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.end_date}
                    min={form.start_date || today}
                    max={
                      form.start_date
                        ? new Date(new Date(form.start_date).setDate(new Date(form.start_date).getDate() + 30))
                            .toISOString().split('T')[0]
                        : sixMonthsLater
                    }
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>

                {/* Only show points field if customer has points */}
                {loyalty?.points > 0 && (
                  <div>
                    <label style={labelStyle}>
                      Points to Redeem (you have {loyalty.points} points)
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      min="0"
                      max={loyalty.points}
                      value={form.points_to_redeem}
                      onChange={e => setForm({ ...form, points_to_redeem: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button style={btnStyle} onClick={handleBook}>Confirm Booking</button>
                <button style={cancelBtn} onClick={() => setBookingCar(null)}>Cancel</button>
              </div>
            </div>
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
const statBox = {
  background: '#0f172a', borderRadius: '8px', padding: '12px',
};
const btnStyle = {
  width: '100%', background: '#f97316', color: 'white',
  border: 'none', borderRadius: '8px', padding: '12px',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};
const cancelBtn = {
  width: '100%', background: 'transparent', color: '#94a3b8',
  border: '1px solid #475569', borderRadius: '8px', padding: '12px',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};
const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
};
const modalBox = {
  background: '#1e293b', border: '1px solid #334155',
  borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px',
};
const labelStyle = { fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '8px' };
const inputStyle = {
  width: '100%', background: '#0f172a', border: '1px solid #334155',
  borderRadius: '8px', padding: '10px 14px', color: '#f8fafc',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};