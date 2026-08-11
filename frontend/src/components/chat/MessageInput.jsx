import React, { useState, useContext } from 'react';
import { Send, Activity, X } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { LanguageContext } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';

export const MessageInput = ({ onSendMessage, loading }) => {
  const [inputText, setInputText] = useState('');
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [symptomFeatures, setSymptomFeatures] = useState({
    fever: 0,
    chills: 0,
    cough: 0,
    joint_pain: 0,
    fever_duration: 3
  });

  const { selectedLanguage } = useContext(LanguageContext);
  const langConfig = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES['od-IN'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const featuresToAttach = showSymptomForm ? symptomFeatures : null;
    onSendMessage(inputText, selectedLanguage, featuresToAttach);
    setInputText('');
    setShowSymptomForm(false);
  };

  const handleVoiceTranscription = (transcript) => {
    if (transcript) {
      setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
    }
  };

  const handleClearInput = () => {
    setInputText('');
  };

  const toggleSymptom = (key) => {
    setSymptomFeatures(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  };

  return (
    <div className="input-container">
      {/* Symptom Checklist Toggle for In-House ML Prediction */}
      {showSymptomForm && (
        <div style={{
          marginBottom: '0.8rem',
          padding: '0.8rem 1rem',
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={14} /> Attach Symptoms for ML Screening:
          </span>
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={symptomFeatures.fever === 1} onChange={() => toggleSymptom('fever')} /> Fever (ଜ୍ଵର/बुखार)
          </label>
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={symptomFeatures.chills === 1} onChange={() => toggleSymptom('chills')} /> Chills (କମ୍ପ/कंपकंपी)
          </label>
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={symptomFeatures.cough === 1} onChange={() => toggleSymptom('cough')} /> Cough (କାସ/खांसी)
          </label>
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={symptomFeatures.joint_pain === 1} onChange={() => toggleSymptom('joint_pain')} /> Joint Pain (ଗଣ୍ଠି ବିନ୍ଧା/जोड़ों में दर्द)
          </label>
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-box">
        <button
          type="button"
          onClick={() => setShowSymptomForm(!showSymptomForm)}
          className="btn-icon"
          style={{ color: showSymptomForm ? 'var(--primary-cyan)' : 'var(--text-muted)', flexShrink: 0 }}
          title="Toggle Symptom Screening Checklist for ML Model"
        >
          <Activity size={20} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={langConfig.placeholder}
          className="chat-input"
          disabled={loading}
        />

        {/* Clear/Delete Text Button */}
        {inputText.trim().length > 0 && (
          <button
            type="button"
            onClick={handleClearInput}
            className="btn-icon"
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}
            title="Clear / Delete Text"
          >
            <X size={18} />
          </button>
        )}

        <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} languageCode={selectedLanguage} />

        <button type="submit" className="btn-icon btn-send" disabled={loading || !inputText.trim()} style={{ flexShrink: 0 }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
