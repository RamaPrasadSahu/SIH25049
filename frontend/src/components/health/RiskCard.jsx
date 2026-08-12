import React from 'react';
import { ShieldAlert, AlertTriangle, ExternalLink, Info } from 'lucide-react';

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

export const OutbreakBanner = ({ alert, alerts }) => {
  const alertList = alerts && alerts.length > 0 ? alerts : (alert ? [alert] : []);
  if (alertList.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {alertList.map((item, idx) => {
        const isHigh = item.severity === 'High';
        const districtsText = Array.isArray(item.districts) ? item.districts.join(', ') : item.districts;

        return (
          <div key={item.id || idx} style={{
            background: isHigh 
              ? 'linear-gradient(90deg, rgba(244, 63, 94, 0.22) 0%, rgba(245, 158, 11, 0.15) 100%)'
              : 'linear-gradient(90deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.12) 100%)',
            border: isHigh ? '1px solid rgba(244, 63, 94, 0.45)' : '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '12px',
            padding: '1rem 1.2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.8rem'
          }}>
            {isHigh ? (
              <AlertTriangle size={24} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <Info size={24} style={{ color: 'var(--primary-cyan)', flexShrink: 0, marginTop: '2px' }} />
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                  🚨 Real-Time Health Alert: {item.disease} ({item.state} — {districtsText})
                </div>
                <span className={`stat-badge ${isHigh ? 'high' : 'moderate'}`}>
                  {item.severity || 'Live Advisory'}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.5 }}>
                {item.advisory}
              </div>

              {item.source && (
                <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Verified Source: <strong>{item.source}</strong></span>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-cyan)', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                      Official Advisory <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
