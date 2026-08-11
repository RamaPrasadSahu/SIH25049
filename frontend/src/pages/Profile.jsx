import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="avatar user" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
              <User size={36} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Ram Kumar'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email || 'ram.health@odisha.gov.in'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-message-ai)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>State & District</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>Odisha, Khurda</div>
            </div>

            <div style={{ background: 'var(--bg-message-ai)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preferred AI Language</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>Odia (ଓଡ଼ିଆ)</div>
            </div>

            <div style={{ background: 'var(--bg-message-ai)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Healthcare Access ID</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', color: 'var(--text-primary)' }}>ABHA-9821-4310</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export const History = () => {
  return (
    <AppLayout>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Conversation History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>All user healthcare conversations are stored securely in Firestore.</p>
      </div>
    </AppLayout>
  );
};

export default Profile;
