import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { Car, Star, Receipt, TrendingUp } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loyalty, setLoyalty] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loyaltyRes, rentalsRes] = await Promise.all([
          API.get(`/customers/${user.customer_id}/loyalty`),
          API.get(`/rentals/customer/${user.customer_id}`),
        ]);
        setLoyalty(loyaltyRes.data);
        setRentals(rentalsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.customer_id) fetchData();
  }, [user]);

  const tierColors = {
    bronze: '#f97316', silver: '#94a3b8',
    gold: '#fbbf24', platinum: '#a78bfa'
  };

  const tierEmoji = {
    bronze: '🥉', silver: '🥈', gold: '👑', platinum: '💎'
  };

  const tier = loyalty?.tier_name?.toLowerCase();
  const activeRentals = rentals.filter(r => r.r_status === 'active').length;
  const completedRentals = rentals.filter(r => r.r_status === 'completed').length;

  // Progress to next tier
  const progressPercent = loyalty
    ? Math.min(100, Math.round(
        (loyalty.loyalty_points / loyalty.next_tier_at) * 100
      ))
    : 0;

  if (loading) return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', paddingTop: '100px', color: '#94a3b8' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc' }}>
            Welcome back 👋
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>{user?.email}</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { icon: <Star size={20} color="#fbbf24" />, label: 'Loyalty Points', value: loyalty?.loyalty_points ?? 0 },
            { icon: <TrendingUp size={20} color="#f97316" />, label: 'Current Tier', value: loyalty?.tier_name ?? 'Bronze' },
            { icon: <Car size={20} color="#22d3ee" />, label: 'Active Rentals', value: activeRentals },
            { icon: <Receipt size={20} color="#a78bfa" />, label: 'Total Rentals', value: rentals.length },
          ].map((stat, i) => (
            <div key={i} style={statCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                {stat.icon}
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#f8fafc' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Loyalty Card */}
        {loyalty && (
          <div style={{ ...card, marginBottom: '32px', borderColor: tierColors[tier] || '#334155' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '20px' }}>
              Loyalty Status
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                background: tierColors[tier] + '30',
                border: `2px solid ${tierColors[tier] || '#f97316'}`,
                borderRadius: '50%', width: '64px', height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px'
              }}>
                {tierEmoji[tier] || '🥉'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '22px', fontWeight: '700', color: tierColors[tier] || '#f97316', textTransform: 'capitalize' }}>
                  {loyalty.tier_name} Member
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
                  {loyalty.loyalty_points} points earned • {loyalty.discount_percent}% discount on every rental
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Your Discount</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#f97316' }}>
                  {loyalty.discount_percent}% off
                </div>
              </div>
            </div>

            {/* Progress to next tier */}
            {loyalty.points_to_next_tier > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Progress to next tier</span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {loyalty.points_to_next_tier} points to go
                  </span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    background: tierColors[tier] || '#f97316',
                    height: '100%',
                    width: `${progressPercent}%`,
                    borderRadius: '99px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  {loyalty.loyalty_points} / {loyalty.next_tier_at} points
                </div>
              </div>
            )}

            {loyalty.points_to_next_tier === 0 && (
              <div style={{ background: '#a78bfa20', border: '1px solid #a78bfa', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <span style={{ color: '#a78bfa', fontWeight: '600', fontSize: '14px' }}>
                  💎 You've reached the highest tier!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/cars')}>
            <Car size={28} color="#f97316" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>Browse Cars</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Find and book your next ride</p>
          </div>
          <div style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/my-rentals')}>
            <Receipt size={28} color="#a78bfa" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>My Rentals</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              {activeRentals > 0
                ? `${activeRentals} active rental${activeRentals > 1 ? 's' : ''}`
                : `${completedRentals} completed rental${completedRentals !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const card = {
  background: '#1e293b', border: '1px solid #334155',
  borderRadius: '12px', padding: '24px',
};
const statCard = {
  background: '#1e293b', border: '1px solid #334155',
  borderRadius: '12px', padding: '24px',
};