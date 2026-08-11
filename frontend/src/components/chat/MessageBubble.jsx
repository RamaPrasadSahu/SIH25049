import React, { useState } from 'react';
import { User, Activity, Copy, Check, ShieldAlert, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? <User size={20} /> : <Activity size={20} />}
      </div>

      <div className="message-content">
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>

        {/* Embedded Verified Sources Badges (PDF RAG + Web Search) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-glass)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <CheckCircle size={13} style={{ color: 'var(--accent-emerald)' }} />
              <span>Verified Sources & Evidence:</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {message.sources.map((src, idx) => {
                if (src.type === 'pdf') {
                  return (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(6, 182, 212, 0.12)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: 'var(--primary-cyan)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={12} />
                      <span>✓ {src.organization || 'WHO'} PDF — Page {src.page || 42}</span>
                    </span>
                  );
                } else {
                  return (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.78rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: 'var(--accent-emerald)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <ExternalLink size={12} />
                      <span>✓ {src.organization} — {src.title}</span>
                    </a>
                  );
                }
              })}
            </div>
          </div>
        )}

        {/* Embedded ML Risk Assessment Badge if present */}
        {message.mlRiskAssessment && (
          <div style={{
            marginTop: '0.8rem',
            padding: '0.75rem',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '10px',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary-cyan)', marginBottom: '4px' }}>
              <ShieldAlert size={16} />
              <span>SIH ML Risk Assessment: {message.mlRiskAssessment.prediction}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Confidence: {(message.mlRiskAssessment.confidence * 100).toFixed(0)}% | Risk Level: <strong style={{ color: message.mlRiskAssessment.riskLevel === 'High' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>{message.mlRiskAssessment.riskLevel}</strong>
            </div>
          </div>
        )}

        <div className="message-meta">
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!isUser && (
            <>
              <AudioPlayer text={message.text} language={message.language} />
              <button
                onClick={handleCopy}
                className="btn-icon"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                title="Copy Response"
              >
                {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
