import React, { useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

export const VoiceRecorder = ({ onTranscriptionComplete, languageCode = 'od-IN' }) => {
  const {
    isRecording,
    recordingTime,
    isProcessing,
    recognizedText,
    error,
    startRecording,
    stopRecording
  } = useVoice(languageCode);

  useEffect(() => {
    if (recognizedText) {
      onTranscriptionComplete(recognizedText);
    }
  }, [recognizedText, onTranscriptionComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {isRecording ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600, animation: 'pulse 1.5s infinite' }}>
            ● {formatTime(recordingTime)}
          </span>
          <button
            type="button"
            onClick={stopRecording}
            className="btn-icon btn-mic recording"
            title="Stop Recording"
          >
            <Square size={16} />
          </button>
        </div>
      ) : isProcessing ? (
        <div className="btn-icon" style={{ color: 'var(--primary-cyan)' }}>
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="btn-icon btn-mic"
          title="Voice Input (Sarvam AI / Web Speech STT)"
        >
          <Mic size={20} />
        </button>
      )}
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
};

export default VoiceRecorder;
