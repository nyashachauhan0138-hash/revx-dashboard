import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get('/rentals/revenue'),
      API.get('/rentals/active'),
    ]).then(([revRes, activeRes]) => {
      setRevenue(revRes.data);
      setActiveRentals(activeRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = revenue.reduce((sum, r) => sum + (parseFloat(r.total_revenue) || 0), 0);
  const totalRentals = revenue.reduce((sum, r) => sum + (parseInt(r.total_rentals) || 0), 0);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Business overview</p>

        {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, color: '#22c55e' },
                { label: 'Total Rentals', value: totalRentals, color: '#f97316' },
                { label: 'Active Rentals', value: activeRentals.length, color: '#22d3ee' },
              ].map((s, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>{s.label}</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Revenue by car */}
            <div style={{ ...cardStyle, marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>Revenue Analytics</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    {['Car ID', 'Total Rentals', 'Revenue', 'Avg Duration'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={tdStyle}>{row.car_id}</td>
                      <td style={tdStyle}>{row.total_rentals}</td>
                      <td style={{ ...tdStyle, color: '#22c55e' }}>₹{parseFloat(row.total_revenue || 0).toFixed(2)}</td>
                      <td style={tdStyle}>{row.avg_duration ? `${parseFloat(row.avg_duration).toFixed(1)} days` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Active Rentals */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>Active Rentals</h2>
                <button
                  style={{ background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => navigate('/admin/rentals')}
                >
                  Manage All
                </button>
              </div>
              {activeRentals.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No active rentals</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      {['Rental ID', 'Customer', 'Car', 'Start', 'End', 'Cost'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRentals.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={tdStyle}>#{r.rental_id}</td>
                        <td style={tdStyle}>{r.customer_name || r.customer_id}</td>
                        <td style={tdStyle}>{r.car_brand ? `${r.car_brand} ${r.car_model}` : r.car_id}</td>
                        <td style={tdStyle}>{r.start_date?.slice(0, 10)}</td>
                        <td style={tdStyle}>{r.end_date?.slice(0, 10)}</td>
                        <td style={{ ...tdStyle, color: '#f97316' }}>₹{r.total_cost ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' };
const tdStyle = { padding: '14px 0', fontSize: '14px', color: '#cbd5e1', borderBottom: '1px solid #1e293b' };