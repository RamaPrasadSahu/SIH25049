import { useState, useRef, useEffect } from 'react';
import { transcribeVoiceAudio } from '../services/voice.service';

export const useVoice = (languageCode = 'od-IN') => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const resetRecognizedText = () => {
    setRecognizedText('');
  };

  const startRecording = async () => {
    setError(null);
    setRecognizedText('');
    setRecordingTime(0);

    // 1. Try Browser Webkit Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Single sentence mode prevents duplicate loops
        recognition.interimResults = false; // Send final transcript only to avoid text repetition

        let speechLang = languageCode;
        if (speechLang === 'od-IN' || speechLang === 'or-IN') speechLang = 'or-IN';
        if (speechLang === 'hi-IN') speechLang = 'hi-IN';
        recognition.lang = speechLang;

        recognition.onresult = (event) => {
          if (event.results && event.results.length > 0) {
            const finalTranscript = event.results[0][0].transcript;
            if (finalTranscript) {
              setRecognizedText(finalTranscript);
            }
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission denied.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);

        timerIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed, using MediaRecorder fallback:', err);
      }
    }

    // 2. MediaRecorder Audio Blob Capture + Sarvam AI Cloud API
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone permission or recording error:', err);
      setError('Microphone access denied or not supported.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  const processAudioBlob = async (blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        const result = await transcribeVoiceAudio(base64Audio, languageCode);
        if (result && result.transcript) {
          setRecognizedText(result.transcript);
        }
        setIsProcessing(false);
      };
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process voice audio.');
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    recordingTime,
    isProcessing,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    resetRecognizedText
  };
};

export default useVoice;
