import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chat.service';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import { useAuth } from '../hooks/useAuth';
import { LanguageContext } from './LanguageContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { selectedLanguage } = useContext(LanguageContext);
  const langConfig = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES['od-IN'];

  // User-specific storage key for chat history persistence
  const storageKey = `swasthya_chats_${user?.uid || 'guest'}`;

  // State: List of all stored conversations for this user
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load chat history:', e);
      return [];
    }
  });

  // State: Active conversation ID (null if brand new uncommitted thread)
  const [currentConvId, setCurrentConvId] = useState(null);

  // State: Current active messages
  const [messages, setMessages] = useState(() => [
    {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      text: langConfig.welcomeMessage,
      createdAt: new Date().toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with localStorage whenever conversations change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [conversations, storageKey]);

  // Load user-specific conversations on auth state change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setConversations(JSON.parse(saved));
      } else {
        setConversations([]);
      }
      startNewChat();
    } catch (e) {
      console.error('Failed to switch user chat history:', e);
    }
  }, [user?.uid]);

  // Update initial welcome message when user switches language on empty new chat
  useEffect(() => {
    if (!currentConvId && messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([
        {
          id: `welcome-${selectedLanguage}`,
          role: 'assistant',
          text: langConfig.welcomeMessage,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [selectedLanguage, currentConvId]);

  // Action 1: Start a New Empty Chat Thread (ChatGPT "+ New Chat" style)
  const startNewChat = () => {
    setCurrentConvId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: langConfig.welcomeMessage,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  // Action 2: Select & Load an existing conversation from Sidebar
  const selectConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConvId(conv.id);
      setMessages(conv.messages || []);
    }
  };

  // Action 3: Delete a conversation from Sidebar
  const deleteConversation = (convId, e) => {
    if (e) e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConvId === convId) {
      startNewChat();
    }
  };

  // Action 4: Send Message (ChatGPT Style - creates conversation on first prompt)
  const sendMessage = async (userText, overrideLang = null, features = null) => {
    if (!userText || !userText.trim()) return;

    const currentLang = overrideLang || selectedLanguage;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      language: currentLang,
      createdAt: new Date().toISOString()
    };

    let activeId = currentConvId;

    if (!activeId) {
      activeId = `conv-${Date.now()}`;
      setCurrentConvId(activeId);
    }

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    // Generate clean short title from first user prompt
    const convTitle = userText.length > 30 ? userText.slice(0, 30) + '...' : userText;
    
    setConversations(prev => {
      const existing = prev.find(c => c.id === activeId);
      if (existing) {
        return prev.map(c => c.id === activeId ? { ...c, messages: updatedMessages, updatedAt: new Date().toISOString() } : c);
      } else {
        return [
          {
            id: activeId,
            title: convTitle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: updatedMessages
          },
          ...prev
        ];
      }
    });

    try {
      const history = updatedMessages.slice(-6).map(m => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(userText, history, currentLang, features);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        language: response.language || currentLang,
        mlRiskAssessment: response.mlRiskAssessment,
        createdAt: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Save complete AI response to conversation history
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: finalMessages, updatedAt: new Date().toISOString() } : c));
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConvId,
      messages,
      loading,
      error,
      sendMessage,
      startNewChat,
      selectConversation,
      deleteConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
