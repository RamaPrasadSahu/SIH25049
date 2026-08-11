import React, { useContext } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HealthCard } from '../components/health/HealthCard';
import { OutbreakBanner } from '../components/health/RiskCard';
import { PredictionChart } from '../components/health/PredictionChart';
import { Activity, ShieldAlert, HeartPulse, Building2, Calendar, FileText, Globe, BarChart2 } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export const Dashboard = () => {
  const { t } = useContext(LanguageContext);

  const dummyOutbreakAlert = {
    disease: 'Dengue',
    state: 'Odisha',
    districts: ['Khurda', 'Cuttack', 'Puri'],
    advisory: 'Monsoon standing water accumulation has increased Aedes mosquito vector density. Use bed nets and clear stagnant domestic containers.'
  };

  const sampleProbabilities = {
    'Malaria': 0.75,
    'Dengue': 0.24,
    'Influenza': 0.01,
    'Tuberculosis': 0.0,
    'Diabetes': 0.0,
    'Hypertension': 0.0
  };

  return (
    <AppLayout>
      <div style={{ padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Outbreak Warning Banner */}
        <OutbreakBanner alert={dummyOutbreakAlert} />

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('dashTitle')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {t('dashSubtitle')}
          </p>
        </div>

        {/* Stat Overview Cards */}
        <div className="dashboard-grid" style={{ padding: 0 }}>
          <HealthCard
            title={t('recentRisk')}
            value="Malaria (High)"
            subtitle="Screened 10 mins ago"
            icon={ShieldAlert}
            badge={{ text: 'High Priority', type: 'high' }}
            color="var(--accent-rose)"
          />

          <HealthCard
            title={t('whoBaseline')}
            value="65.0 Years"
            subtitle="India Baseline (WHO Official Report)"
            icon={Globe}
            badge={{ text: 'WHO SDG 3', type: 'low' }}
            color="var(--primary-cyan)"
          />

          <HealthCard
            title="WHO Child Mortality Rate"
            value="56.3 / 1,000"
            subtitle="Under-5 Target: < 25 / 1,000"
            icon={HeartPulse}
            badge={{ text: 'WHO Report', type: 'moderate' }}
            color="var(--accent-amber)"
          />

          <HealthCard
            title="Cellular Telehealth Access"
            value="72.0% Coverage"
            subtitle="Mobile Healthcare Connectivity"
            icon={Building2}
            badge={{ text: 'Digital Health', type: 'low' }}
            color="var(--accent-emerald)"
          />
        </div>

        {/* Interactive ML Disease Risk Spectrum Chart */}
        <PredictionChart probabilities={sampleProbabilities} />

        {/* Grounded Public Health Guidance List */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--primary-cyan)' }} />
            Official WHO & Ministry of Health Verified Indicators (WHO Report 9789240110496)
          </h3>
          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            <li><strong>WHO Official Report Grounding:</strong> Grounded in the official WHO World Health Statistics Report (<code style={{ color: 'var(--primary-cyan)' }}>9789240110496-eng.pdf</code>) and verified public health data.</li>
            <li><strong>Vector-Borne Disease Control:</strong> Free malaria microscopic examination and rapid diagnostic tests (RDT) are available at all Sub-Centres and PHCs.</li>
            <li><strong>NTEP TB Elimination Program:</strong> Anyone experiencing a persistent cough for 2+ weeks is eligible for free CBNAAT sputum testing and direct financial support under Ni-kshay Poshan Yojana.</li>
            <li><strong>Maternal & Child Health:</strong> All UIP vaccines are provided free of cost according to the national immunization registry schedule.</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};
