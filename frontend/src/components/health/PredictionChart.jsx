import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const PredictionChart = ({ probabilities }) => {
  if (!probabilities) return null;

  const data = Object.keys(probabilities).map((key) => ({
    name: key,
    probability: Math.round(probabilities[key] * 100)
  }));

  const colors = ['#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#3b82f6'];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        ML Model Disease Probability Spectrum (%)
      </h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} unit="%" />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff' }}
              formatter={(val) => [`${val}%`, 'Probability']}
            />
            <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
