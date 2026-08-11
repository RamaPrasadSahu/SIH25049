import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const RiskCard = ({ prediction }) => {
  if (!prediction) return null;
  const isHigh = prediction.riskLevel === 'High';
  return (
    <div className="glass-panel" style={{ padding: '1.2rem', borderColor: isHigh ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-glass)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1rem', color: isHigh ? 'var(--accent-rose)' : 'var(--primary-cyan)' }}>
          <ShieldAlert size={20} />
          <span>{prediction.prediction} Screening</span>
        </div>
        <span className={`stat-badge ${prediction.riskLevel.toLowerCase()}`}>{prediction.riskLevel} Risk</span>
      </div>
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        ML Confidence: {(prediction.confidence * 100).toFixed(1)}% ({prediction.modelVersion})
      </div>
    </div>
  );
};

export const OutbreakBanner = ({ alert }) => (
  <div style={{
    background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
    border: '1px solid rgba(244, 63, 94, 0.4)',
    borderRadius: '12px',
    padding: '1rem 1.2rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  }}>
    <AlertTriangle size={24} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
    <div>
      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
        ⚠️ Public Health Alert: {alert.disease} Outbreak Warning - {alert.state} ({alert.districts.join(', ')})
      </div>
      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>
        {alert.advisory}
      </div>
    </div>
  </div>
);
