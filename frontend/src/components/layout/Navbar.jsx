import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut, LayoutDashboard, MessageSquare, Sun, Moon } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { selectedLanguage, setSelectedLanguage, supportedLanguages, t } = useContext(LanguageContext);
  const { theme, toggleTheme, logo } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-header navbar">
      <Link to="/home" style={{ textDecoration: 'none' }}>
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={logo}
            alt="Swasthya Sakha Logo"
            style={{
              height: '42px',
              width: 'auto',
              borderRadius: '10px',
              objectFit: 'contain',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.3s ease'
            }}
          />
          <span style={{ fontWeight: 800, letterSpacing: '-0.3px' }}>{t('brandName')}</span>
        </div>
      </Link>

      <div className="nav-actions">
        {/* Theme Toggle Button (Light vs Dark) */}
        <button
          onClick={toggleTheme}
          className="btn-icon theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          style={{
            background: 'var(--border-glass)',
            border: '1px solid var(--border-hover)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease'
          }}
        >
          {theme === 'dark' ? (
            <Sun size={19} style={{ color: '#f59e0b' }} />
          ) : (
            <Moon size={19} style={{ color: '#0284c7' }} />
          )}
        </button>

        {/* Multilingual Language Switcher */}
        <div className="language-selector">
          <Globe size={18} style={{ color: 'var(--primary-cyan)' }} />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {Object.values(supportedLanguages).map((lang) => (
              <option key={lang.code} value={lang.code} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Dashboard Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-icon"
          title={t('dashboard')}
        >
          <LayoutDashboard size={20} />
        </button>

        {/* Chat Link */}
        <button
          onClick={() => navigate('/chat')}
          className="btn-icon"
          title={t('chat')}
        >
          <MessageSquare size={20} />
        </button>

        {/* User Profile & Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => navigate('/profile')}
              className="btn-icon"
              title={t('profile')}
            >
              <User size={20} />
            </button>
            <button
              onClick={logout}
              className="btn-icon"
              title={t('signOut')}
              style={{ color: 'var(--accent-rose)' }}
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>{t('signIn')}</button>
          </Link>
        )}
      </div>
    </header>
  );
};
