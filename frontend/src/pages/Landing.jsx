import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mic, Globe, ShieldAlert, Sparkles, ArrowRight, HeartPulse } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useContext(LanguageContext);

  return (
    <AppLayout>
      <div style={{ minHeight: 'calc(100vh - 70px)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
        {/* Hero Header */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '20px', color: 'var(--primary-cyan)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> {t('sihBadge')}
          </div>

          <h1 className="hero-title">
            {t('heroTitle')} <br /> {t('heroSub')}
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            {t('heroDesc')}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/chat')} className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>{t('startAssistant')}</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="glass-panel"
              style={{
                padding: '0.9rem 1.8rem',
                fontSize: '1.05rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              {t('viewAnalytics')}
            </button>
          </div>
        </div>

        {/* Core Features Grid */}
        <div style={{ maxWidth: '1100px', margin: '2rem auto 4rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.8rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-cyan)', marginBottom: '1rem' }}>
              <Globe size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('langFeatureTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {t('langFeatureDesc')}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.8rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
              <Mic size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('voiceFeatureTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {t('voiceFeatureDesc')}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.8rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', marginBottom: '1rem' }}>
              <HeartPulse size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t('mlFeatureTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {t('mlFeatureDesc')}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Landing;
