import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Splash = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, logo } = useTheme();

  // Automatic smooth transition after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/auth')}
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: theme === 'light'
          ? 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5f9 85%)'
          : 'radial-gradient(circle at 50% 45%, #0f172a 0%, #0b0f19 80%)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
        transition: 'background 0.4s ease'
      }}
    >
      {/* Top Bar Theme Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          className="btn-icon"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-hover)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? (
            <Sun size={20} style={{ color: '#f59e0b' }} />
          ) : (
            <Moon size={20} style={{ color: '#0284c7' }} />
          )}
        </button>
      </div>

      {/* Background Floating Ambient Orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* Centerpiece Container with Staggered Entrance */}
      <div style={{ textAlign: 'center', zIndex: 2, maxWidth: '650px' }}>
        
        {/* Dynamic Theme Brand Logo */}
        <div className="splash-logo-box">
          <div className="splash-logo-glow" />
          <div className="splash-logo-card">
            <img
              src={logo}
              alt="Swasthya Sakha Logo"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                borderRadius: '24px'
              }}
            />
          </div>
        </div>

        {/* EKG / Heartbeat Wave Animation */}
        <div style={{ margin: '0 auto 1.2rem auto', width: '220px', height: '35px', overflow: 'hidden' }}>
          <svg viewBox="0 0 500 100" className="ekg-svg">
            <path
              d="M0,50 L120,50 L140,20 L160,80 L180,10 L200,90 L220,50 L500,50"
              fill="none"
              stroke="url(#ekgGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ekg-path"
            />
            <defs>
              <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main Title Reveal */}
        <h1 className="splash-title">
          Swasthya Sakha
        </h1>

        {/* Native Script Names Reveal */}
        <div className="splash-native-title">
          <span>स्वास्थ्य सखा</span>
          <span className="dot-sep">•</span>
          <span>ସ୍ୱାସ୍ଥ୍ୟ ସଖା</span>
          <span className="dot-sep">•</span>
          <span>स्वास्थ्य सखा</span>
        </div>

        {/* Subtitle / Tagline Reveal */}
        <p className="splash-subtitle">
          Your Health. Our Priority. Always With You.
        </p>

        {/* Animated Action Button */}
        <div className="splash-btn-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/auth');
            }}
            className="btn-primary splash-btn"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Animated Progress Loader Bar */}
        <div className="splash-progress-track">
          <div className="splash-progress-fill" />
        </div>

      </div>

      {/* Premium Keyframe Animations Styling */}
      <style>{`
        /* Floating Orbs */
        .splash-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }
        .splash-orb-1 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%);
          animation: floatOrb 8s ease-in-out infinite alternate;
        }
        .splash-orb-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%);
          animation: floatOrb 10s ease-in-out infinite alternate-reverse;
          bottom: 10%;
          right: 15%;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.1); }
        }

        /* Animated Logo Box */
        .splash-logo-box {
          margin: 0 auto 1.2rem auto;
          width: 108px;
          height: 108px;
          position: relative;
          animation: logoEntrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .splash-logo-glow {
          position: absolute;
          inset: -14px;
          border-radius: 36px;
          background: var(--primary-gradient);
          opacity: 0.45;
          filter: blur(18px);
          animation: pulseGlow 2.5s ease-in-out infinite;
        }

        .splash-logo-card {
          width: 108px;
          height: 108px;
          border-radius: 28px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 3;
          animation: logoFloat 4s ease-in-out infinite;
        }

        @keyframes logoEntrance {
          0% { transform: scale(0.3) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.65; }
        }

        /* EKG Wave Path Animation */
        .ekg-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: ekgDraw 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes ekgDraw {
          0% { stroke-dashoffset: 600; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -600; }
        }

        /* Text Entrance Staggering */
        .splash-title {
          font-size: 3.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 0.8rem;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
        }

        .splash-native-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-cyan);
          margin-bottom: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.8rem;
          opacity: 0.95;
          animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards;
        }

        .dot-sep {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .splash-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 2.2rem;
          line-height: 1.5;
          animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s backwards;
        }

        @keyframes titleFadeUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .splash-btn-wrap {
          animation: titleFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s backwards;
        }

        .splash-btn {
          padding: 0.95rem 2.8rem;
          font-size: 1.15rem;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          transition: all 0.3s ease;
        }

        .splash-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 40px rgba(6, 182, 212, 0.6);
        }

        .splash-progress-track {
          margin-top: 2.5rem;
          width: 180px;
          height: 4px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          margin: 2.5rem auto 0 auto;
          overflow: hidden;
          animation: titleFadeUp 0.8s ease-out 1.1s backwards;
        }

        .splash-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #06b6d4, #34d399);
          animation: fillProgress 3.5s linear forwards;
          border-radius: 4px;
        }

        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Splash;
