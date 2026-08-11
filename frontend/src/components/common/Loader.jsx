import React from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-cyan)', padding: '1rem' }}>
    <Loader2 className="animate-spin" size={20} />
    <span>{text}</span>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid rgba(244, 63, 94, 0.4)',
    color: '#f43f5e',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    margin: '0.5rem 0'
  }}>
    <AlertCircle size={18} />
    <span>{message}</span>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};
