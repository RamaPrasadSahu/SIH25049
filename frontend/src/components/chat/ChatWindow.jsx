import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { Activity, ShieldAlert, Sparkles, Stethoscope } from 'lucide-react';

export const ChatWindow = ({ messages, loading, onSendMessage }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    { label: "High Fever & Chills (Malaria/Dengue)", text: "ମୋତେ ୩ ଦିନ ହେଲାଣି ପ୍ରବଳ ଜ୍ଵର ଏବଂ କମ୍ପ ହେଉଛି। ମୋର କ’ଣ କରିବା ଉଚିତ୍?" },
    { label: "Child Vaccination Schedule", text: " What is the official UIP vaccination schedule for a 9-month-old infant?" },
    { label: "Tuberculosis Warning Signs", text: "What are the early symptom warning signs of Tuberculosis (TB) according to NTEP?" },
    { label: "Nearest PHC Centre Info", text: "How can I find my nearest Primary Health Centre in Odisha for free blood tests?" }
  ];

  return (
    <div className="chat-container">
      <div className="messages-scroll">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Activity size={32} style={{ color: '#fff' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Swasthya Sakha (स्वास्थ्य सखा)</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
              Your AI-driven public health companion for disease awareness, symptom screening, and official health advice across India.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', maxWidth: '650px', margin: '0 auto' }}>
              {quickPrompts.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => onSendMessage(p.text)}
                  className="glass-panel"
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    transition: 'all 0.2s ease',
                    borderColor: 'var(--border-glass)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--primary-cyan)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> {p.label}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {loading && <TypingIndicator />}
        <div ref={scrollRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} loading={loading} />
    </div>
  );
};
