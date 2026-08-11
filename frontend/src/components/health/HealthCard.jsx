import React from 'react';

export const HealthCard = ({ title, value, subtitle, icon: Icon, badge, color = 'var(--primary-cyan)' }) => (
  <div className="glass-panel stat-card">
    <div className="stat-header">
      <span>{title}</span>
      {Icon && <Icon size={20} style={{ color }} />}
    </div>
    <div className="stat-value">{value}</div>
    {badge && (
      <div>
        <span className={`stat-badge ${badge.type}`}>{badge.text}</span>
      </div>
    )}
    {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
  </div>
);
