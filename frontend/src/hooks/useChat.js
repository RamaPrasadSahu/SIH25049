import { useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chat.service';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export const useChat = (selectedLanguage = 'od-IN') => {
  const langConfig = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES['od-IN'];

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: langConfig.welcomeMessage,
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update initial welcome message when user switches language in Navbar
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant' && prev[0].id.startsWith('welcome-')) {
        return [
          {
            id: `welcome-${selectedLanguage}`,
            role: 'assistant',
            text: langConfig.welcomeMessage,
            createdAt: new Date().toISOString()
          }
        ];
      }
      return prev;
    });
  }, [selectedLanguage]);

  const sendMessage = async (userText, overrideLang = null, features = null) => {
    if (!userText || !userText.trim()) return;

    const currentLang = overrideLang || selectedLanguage;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      language: currentLang,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(userText, history, currentLang, features);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        language: response.language || currentLang,
        mlRiskAssessment: response.mlRiskAssessment,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: langConfig.welcomeMessage,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  };
};
