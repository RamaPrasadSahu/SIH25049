import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut, LayoutDashboard, MessageSquare, Sun, Moon, Menu } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = ({ onToggleSidebar, showSidebarToggle }) => {
  const { selectedLanguage, setSelectedLanguage, supportedLanguages, t } = useContext(LanguageContext);
  const { theme, toggleTheme, logo } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-header navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Mobile Hamburger Sidebar Toggle Button */}
        {showSidebarToggle && (
          <button
            onClick={onToggleSidebar}
            className="btn-icon mobile-menu-btn"
            title="Toggle Sidebar Menu"
            style={{
              background: 'var(--bg-message-ai)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px'
            }}
          >
            <Menu size={20} style={{ color: 'var(--primary-cyan)' }} />
          </button>
        )}

        <Link to="/home" style={{ textDecoration: 'none' }}>
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={logo}
              alt="Swasthya Sakha Logo"
              style={{
                height: '36px',
                width: 'auto',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.3s ease'
              }}
            />
            <span className="brand-title-text" style={{ fontWeight: 800, letterSpacing: '-0.3px' }}>{t('brandName')}</span>
          </div>
        </Link>
      </div>

      <div className="nav-actions">
        {/* Multilingual Language Switcher */}
        <div className="language-selector">
          <Globe size={15} style={{ color: 'var(--primary-cyan)', flexShrink: 0 }} />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
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

        {/* Theme Toggle Button (Light vs Dark) */}
        <button
          onClick={toggleTheme}
          className="btn-icon theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          style={{
            background: 'var(--border-glass)',
            border: '1px solid var(--border-hover)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease',
            flexShrink: 0
          }}
        >
          {theme === 'dark' ? (
            <Sun size={17} style={{ color: '#f59e0b' }} />
          ) : (
            <Moon size={17} style={{ color: '#0284c7' }} />
          )}
        </button>

        {/* Desktop Navigation Links */}
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-icon nav-desktop-only"
          title={t('dashboard')}
        >
          <LayoutDashboard size={19} />
        </button>

        <button
          onClick={() => navigate('/chat')}
          className="btn-icon nav-desktop-only"
          title={t('chat')}
        >
          <MessageSquare size={19} />
        </button>

        {/* User Profile & Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <button
              onClick={() => navigate('/profile')}
              className="btn-icon"
              title={t('profile')}
            >
              <User size={19} />
            </button>
            <button
              onClick={logout}
              className="btn-icon"
              title={t('signOut')}
              style={{ color: 'var(--accent-rose)' }}
            >
              <LogOut size={19} />
            </button>
          </div>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>{t('signIn')}</button>
          </Link>
        )}
      </div>
    </header>
  );
};
