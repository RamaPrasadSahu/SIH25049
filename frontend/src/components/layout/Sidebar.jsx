import React, { useContext } from 'react';
import { Plus, MessageSquare, ShieldAlert, HeartPulse, Sun, Moon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import { useChatContext } from '../../context/ChatContext';

export const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useContext(LanguageContext);
  const { conversations, currentConvId, startNewChat, selectConversation, deleteConversation } = useChatContext();

  const handleNewChatClick = () => {
    startNewChat();
    navigate('/chat');
  };

  const handleSelectConv = (id) => {
    selectConversation(id);
    navigate('/chat');
  };

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <button onClick={handleNewChatClick} className="btn-new-chat">
          <Plus size={18} />
          <span>{t('newQuery')}</span>
        </button>
      </div>

      <div className="conversation-list">
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.5rem 0.8rem', textTransform: 'uppercase' }}>
          {t('recentConvs')}
        </div>

        {conversations.length === 0 ? (
          <div style={{ padding: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No recent chats yet. Start a conversation above!
          </div>
        ) : (
          conversations.map((item) => {
            const isActive = item.id === currentConvId;
            return (
              <div
                key={item.id}
                className={`conv-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectConv(item.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', flex: 1 }}>
                  <MessageSquare size={16} style={{ color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.86rem' }}>
                    {item.title}
                  </span>
                </div>
                
                {/* Delete Conversation Button */}
                <button
                  type="button"
                  onClick={(e) => deleteConversation(item.id, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    opacity: 0.6,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = 'var(--accent-rose)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                  title="Delete Conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}



        {/* Sidebar Theme Toggle Item */}
        <div className="conv-item" onClick={toggleTheme} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '0.8rem' }}>
          {theme === 'dark' ? (
            <>
              <Sun size={18} style={{ color: '#f59e0b' }} />
              <span>{t('switchTheme')}</span>
            </>
          ) : (
            <>
              <Moon size={18} style={{ color: '#0284c7' }} />
              <span>{t('switchTheme')}</span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
