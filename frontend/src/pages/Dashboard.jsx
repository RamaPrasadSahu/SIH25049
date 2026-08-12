import React, { useContext, useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HealthCard } from '../components/health/HealthCard';
import { OutbreakBanner } from '../components/health/RiskCard';
import { PredictionChart } from '../components/health/PredictionChart';
import { ShieldAlert, HeartPulse, Building2, FileText, Globe, RefreshCw, MessageSquarePlus, Activity, ExternalLink, CheckCircle2 } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getRealTimeDashboardData, getRelativeTimeString } from '../services/dashboard.service';

export const Dashboard = () => {
  const { t } = useContext(LanguageContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);

  const loadRealTimeData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getRealTimeDashboardData(user?.uid);
      setDashboardData(data);
      setSecondsSinceSync(0);
    } catch (err) {
      console.error('Failed to load real-time dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and 10-second backend polling loop
  useEffect(() => {
    loadRealTimeData();
    const fetchInterval = setInterval(() => {
      loadRealTimeData(true);
    }, 10000);

    return () => clearInterval(fetchInterval);
  }, [user?.uid]);

  // 1-second live clock ticker for active time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceSync(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const screening = dashboardData?.latestScreening;
  const metrics = dashboardData?.metrics;
  const probabilities = dashboardData?.probabilities;
  const alerts = dashboardData?.alerts || [];

  // Compute live relative time for screening card dynamically according to current time
  const liveScreeningTimeAgo = screening?.timestamp ? getRelativeTimeString(screening.timestamp) : 'Ready for symptom screening';

  return (
    <AppLayout>
      <div style={{ padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Real-Time Live Sync Status Banner (Updates every second) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '12px',
          padding: '0.8rem 1.2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              LIVE Real-Time Health Stream & AI Brain Active
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
              • Synced {secondsSinceSync === 0 ? 'Just now' : `${secondsSinceSync}s ago`}
            </span>
          </div>

          <button
            onClick={() => loadRealTimeData(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '8px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--primary-cyan)',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Syncing...' : 'Force Live Update'}
          </button>
        </div>

        {/* Live Outbreak Warning Banners */}
        {alerts.length > 0 && <OutbreakBanner alerts={alerts} />}

        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('dashTitle')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t('dashSubtitle')} — Real-time Public Health & Personal Symptom Stream
            </p>
          </div>

          <button
            onClick={() => navigate('/chat')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: 600,
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
              fontSize: '0.9rem'
            }}
          >
            <MessageSquarePlus size={18} />
            Start New AI Health Screening
          </button>
        </div>

        {/* Dynamic Real-Time Stat Overview Cards */}
        <div className="dashboard-grid" style={{ padding: 0 }}>
          <HealthCard
            title={t('recentRisk')}
            value={screening?.disease ? `${screening.disease} (${screening.riskLevel})` : 'No Active Symptoms'}
            subtitle={liveScreeningTimeAgo}
            icon={ShieldAlert}
            badge={{
              text: screening?.disease && screening.disease !== 'No Screening Recorded Yet'
                ? `${screening.riskLevel} Priority`
                : 'Normal System Status',
              type: screening?.riskLevel === 'High' ? 'high' : screening?.riskLevel === 'Moderate' ? 'moderate' : 'low'
            }}
            color={screening?.riskLevel === 'High' ? 'var(--accent-rose)' : 'var(--primary-cyan)'}
          />

          <HealthCard
            title={t('whoBaseline')}
            value={metrics?.whoLifeExpectancy || '67.2 Years'}
            subtitle={metrics?.whoLifeExpectancySubtitle || 'India Baseline (WHO Official Report)'}
            icon={Globe}
            badge={{ text: 'WHO SDG 3', type: 'low' }}
            color="var(--primary-cyan)"
          />

          <HealthCard
            title="WHO Child Mortality Target"
            value={metrics?.under5Mortality || '35.2 / 1,000'}
            subtitle={metrics?.under5MortalitySubtitle || 'Under-5 Target: < 25 / 1,000'}
            icon={HeartPulse}
            badge={{ text: 'WHO Report', type: 'moderate' }}
            color="var(--accent-amber)"
          />

          <HealthCard
            title="Cellular Telehealth Network"
            value={metrics?.telehealthAccess || '84.5% Coverage'}
            subtitle={metrics?.telehealthAccessSubtitle || 'Ayushman Bharat Digital Health'}
            icon={Building2}
            badge={{ text: 'Digital Health', type: 'low' }}
            color="var(--accent-emerald)"
          />
        </div>

        {/* Dynamic ML Disease Risk Spectrum Chart */}
        {probabilities && (
          <PredictionChart probabilities={probabilities} />
        )}

        {/* Real-time Consultations & Screenings Callout if no recent screening */}
        {(!screening || screening.disease === 'No Screening Recorded Yet') && (
          <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--primary-cyan)', padding: '0.8rem', borderRadius: '12px', color: '#0f172a' }}>
                <Activity size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
                  No Active Symptom Screening Recorded For Your Account
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Talk to Swasthya Sakha AI in Odia, Hindi, or English to receive instant triage guidance & diagnostic risk spectrum analysis.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/chat')}
              style={{
                background: 'var(--primary-cyan)',
                color: '#0f172a',
                fontWeight: 700,
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Start Symptom Check
            </button>
          </div>
        )}

        {/* Prominent Verified Official Government & Public Health Sources Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--primary-cyan)' }} />
            Verified Government & Official Public Health Data Sources
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <a
              href="https://ncvbdc.mohfw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.5)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Government of India (MoHFW)
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  NCVBDC Official Portal
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  National Center for Vector Borne Diseases Control official disease surveillance portal.
                </div>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                ncvbdc.mohfw.gov.in <ExternalLink size={14} />
              </div>
            </a>

            <a
              href="https://ncvbdc.mohfw.gov.in/dengue.html"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.5)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Vector Disease Guidelines
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  NCVBDC Dengue Advisory
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  National clinical protocols, diagnostic guidelines, and vector control measures.
                </div>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                ncvbdc.mohfw.gov.in/dengue.html <ExternalLink size={14} />
              </div>
            </a>

            <a
              href="https://www.mohfw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.5)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Ministry of Health
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  MoHFW India Portal
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Official Ministry of Health and Family Welfare public health alerts & health programs.
                </div>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                mohfw.gov.in <ExternalLink size={14} />
              </div>
            </a>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} style={{ color: 'var(--primary-cyan)' }} />
              WHO Grounding (Official WHO Report 9789240110496)
            </h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.88rem', margin: 0 }}>
              <li><strong>Vector-Borne Disease Control:</strong> Free malaria microscopic examination and rapid diagnostic tests (RDT) are available at all Sub-Centres and PHCs.</li>
              <li><strong>NTEP TB Elimination Program:</strong> Anyone experiencing a persistent cough for 2+ weeks is eligible for free CBNAAT sputum testing and direct financial support under Ni-kshay Poshan Yojana.</li>
              <li><strong>Maternal & Child Health:</strong> All UIP vaccines are provided free of cost according to the national immunization registry schedule.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
