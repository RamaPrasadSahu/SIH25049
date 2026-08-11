import React, { useState, useEffect } from 'react';
import { Activity, Search, Database, ShieldCheck } from 'lucide-react';

export const TypingIndicator = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    { text: 'Searching medical sources...', icon: <Search size={13} style={{ color: 'var(--primary-cyan)' }} /> },
    { text: 'Checking PDF knowledge base...', icon: <Database size={13} style={{ color: 'var(--accent-amber)' }} /> },
    { text: 'Verifying sources & safety...', icon: <ShieldCheck size={13} style={{ color: 'var(--accent-emerald)' }} /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="message-bubble assistant">
      <div className="avatar assistant">
        <Activity size={18} />
      </div>
      <div className="message-content">
        <div className="typing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {steps[stepIndex].icon}
          <span>{steps[stepIndex].text}</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
