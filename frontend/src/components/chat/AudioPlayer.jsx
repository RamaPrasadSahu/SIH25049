import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { generateTextToSpeechAudio } from '../../services/voice.service';

export const AudioPlayer = ({ text, language = 'or-IN' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const speakText = async () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Try Sarvam TTS API
      const response = await generateTextToSpeechAudio(text, language);
      if (response && response.audios && response.audios.length > 0) {
        const audioSrc = `data:audio/wav;base64,${response.audios[0]}`;
        const audio = new Audio(audioSrc);
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Sarvam TTS API failed, falling back to Web Speech Synthesis:', e);
    }

    // 2. Web Speech API fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      alert('Text-to-Speech audio is not supported in this browser.');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={speakText}
      disabled={loading}
      className="btn-icon"
      style={{
        padding: '0.2rem 0.5rem',
        fontSize: '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: isPlaying ? 'var(--primary-cyan)' : 'var(--text-muted)'
      }}
      title="Listen to response (Sarvam TTS)"
    >
      {isPlaying ? <Pause size={14} /> : <Volume2 size={14} />}
      <span>{isPlaying ? 'Pause' : 'Listen'}</span>
    </button>
  );
};
