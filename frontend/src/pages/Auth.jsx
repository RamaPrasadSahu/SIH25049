import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Activity, Mail, Lock, LogIn, UserPlus, Eye, EyeOff, CheckCircle, ShieldAlert, ArrowLeft, UserCheck, Stethoscope, Sparkles, ShieldCheck, Zap, Target, Move, Lock as LockIcon, Unlock, ChevronDown, Sun, Moon } from 'lucide-react';
import { ErrorMessage } from '../components/common/Loader';

export const Auth = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [role, setRole] = useState('citizen'); // citizen, asha, doctor
  const [stateDistrict, setStateDistrict] = useState('Odisha - Khurda');
  const [language, setLanguage] = useState('od-IN');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // GAME MODE MOVEMENT STATES
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [pos, setPos] = useState(() => ({
    x: Math.max(20, (window.innerWidth - 260) / 2 + (Math.random() - 0.5) * 160),
    y: Math.max(30, (window.innerHeight - 200) / 2 + (Math.random() - 0.5) * 120)
  }));
  const [vel, setVel] = useState({ vx: 1.8, vy: 1.5 });

  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const animFrameRef = useRef(null);

  const { setUser } = useAuth();
  const { theme, toggleTheme, logo } = useTheme();
  const navigate = useNavigate();

  // 1. High-Tech Constellation Particle Canvas Effect (Theme-Adaptive)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = [];
    const mouse = { x: width / 2, y: height / 2, radius: 150 };

    const primaryColor = theme === 'light' ? '#0284c7' : '#06b6d4';
    const secondaryColor = theme === 'light' ? '#059669' : '#10b981';

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.4 ? primaryColor : secondaryColor
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme === 'light'
              ? `rgba(2, 132, 199, ${0.35 - dist / 520})`
              : `rgba(6, 182, 212, ${0.25 - dist / 520})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = theme === 'light'
            ? `rgba(13, 148, 136, ${0.5 - mdist / 400})`
            : `rgba(56, 189, 248, ${0.4 - mdist / 400})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // 2. GAME MOTION LOOP: Floating / Bouncing Closed Capsule Physics
  useEffect(() => {
    if (isLocked || isLocking) return;

    let currPos = { ...pos };
    let currVel = { ...vel };

    const updatePhysics = () => {
      const boxWidth = 260;
      const boxHeight = 220;
      const marginX = 15;
      const marginY = 15;

      const maxX = Math.max(50, window.innerWidth - boxWidth - marginX);
      const maxY = Math.max(50, window.innerHeight - boxHeight - marginY);

      currPos.x += currVel.vx;
      currPos.y += currVel.vy;

      if (currPos.x <= marginX) {
        currPos.x = marginX;
        currVel.vx = Math.abs(currVel.vx);
      } else if (currPos.x >= maxX) {
        currPos.x = maxX;
        currVel.vx = -Math.abs(currVel.vx);
      }

      if (currPos.y <= marginY) {
        currPos.y = marginY;
        currVel.vy = Math.abs(currVel.vy);
      } else if (currPos.y >= maxY) {
        currPos.y = maxY;
        currVel.vy = -Math.abs(currVel.vy);
      }

      setPos({ x: currPos.x, y: currPos.y });
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLocked, isLocking]);

  // 3. TARGET LOCK CLICK HANDLER: Stop floating, center box, and open full Auth form!
  const handleBoxClick = (e) => {
    if (isLocked || isLocking) return;
    e.stopPropagation();

    setIsLocking(true);
    const centerX = Math.max(10, (window.innerWidth - 390) / 2);
    const centerY = Math.max(10, (window.innerHeight - 540) / 2);

    setPos({ x: centerX, y: centerY });

    setTimeout(() => {
      setIsLocked(true);
      setIsLocking(false);
    }, 650);
  };

  // Re-release Game Floating Mode toggle (Folds back into closed capsule)
  const toggleGameMode = (e) => {
    e.stopPropagation();
    if (isLocked) {
      setIsLocked(false);
      setIsLocking(false);
      setVel({
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random()),
        vy: (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random())
      });
    } else {
      setIsLocking(true);
      const centerX = Math.max(10, (window.innerWidth - 390) / 2);
      const centerY = Math.max(10, (window.innerHeight - 540) / 2);
      setPos({ x: centerX, y: centerY });
      setTimeout(() => {
        setIsLocked(true);
        setIsLocking(false);
      }, 650);
    }
  };

  // 3D Mouse Parallax Card Tilt Handler (Active when locked and opened)
  const handleCardMouseMove = (e) => {
    if (!cardRef.current || !isLocked) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -5,
      y: (x / (rect.width / 2)) * 5
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Handle email/password login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPassword);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle account registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerWithEmail(regName, regEmail, regPassword);
      if (res && res.user) {
        setUser({
          uid: res.user.uid,
          name: regName,
          email: regEmail,
          role: role,
          district: stateDistrict,
          language: language
        });
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    }
  };

  // Demo user quick login handler
  const handleQuickDemoLogin = (demoRole) => {
    setError('');
    let demoUser = {
      uid: 'demo-user-123',
      name: 'Ram Kumar (Odisha Citizen)',
      email: 'ram.health@odisha.gov.in',
      role: 'citizen',
      district: 'Odisha - Khurda',
      isDemo: true
    };

    if (demoRole === 'asha') {
      demoUser = {
        uid: 'demo-asha-456',
        name: 'Sunita Devi (ASHA Worker)',
        email: 'sunita.asha@odisha.gov.in',
        role: 'asha',
        district: 'Odisha - Cuttack',
        isDemo: true
      };
    } else if (demoRole === 'doctor') {
      demoUser = {
        uid: 'demo-doctor-789',
        name: 'Dr. Rajesh Verma (PHC Medical Officer)',
        email: 'dr.rajesh@nhm.gov.in',
        role: 'doctor',
        district: 'Odisha - Capital PHC',
        isDemo: true
      };
    }

    setUser(demoUser);
    navigate('/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme === 'light'
        ? 'radial-gradient(circle at 50% 40%, #e0f2fe 0%, #f8fafc 85%)'
        : 'radial-gradient(circle at 50% 40%, #0f172a 0%, #080c14 85%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* 3D Particle Constellation Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Navigation Controls */}
      <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', right: '1.2rem', display: 'flex', justifyContent: 'space-between', zIndex: 20, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => navigate('/splash')}
            className="btn-icon auth-top-back"
            style={{
              width: 'auto',
              padding: '0.45rem 0.9rem',
              borderRadius: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-hover)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
            }}
          >
            <ArrowLeft size={15} style={{ color: 'var(--primary-cyan)' }} />
            <span>Splash Intro</span>
          </button>

          <button
            onClick={toggleTheme}
            className="btn-icon"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-hover)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <Sun size={18} style={{ color: '#f59e0b' }} />
            ) : (
              <Moon size={18} style={{ color: '#0284c7' }} />
            )}
          </button>
        </div>

        <button
          onClick={toggleGameMode}
          className="btn-icon"
          style={{
            width: 'auto',
            padding: '0.45rem 0.95rem',
            borderRadius: '24px',
            background: isLocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.25)',
            border: isLocked ? '1px solid var(--accent-emerald)' : '1px solid var(--primary-cyan)',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
          }}
          title="Toggle Bouncing Floating Mode vs Open Centered Lock"
        >
          <Move size={15} className={isLocked ? '' : 'animate-spin'} style={{ color: isLocked ? 'var(--accent-emerald)' : 'var(--primary-cyan)' }} />
          <span>{isLocked ? '🔒 Fold Capsule & Float' : '🎮 Click Floating Orb to Open'}</span>
        </button>
      </div>

      {/* GAMIFIED MOVABLE CLOSED OBJECT / OPENED FORM CARD */}
      <div
        ref={cardRef}
        onClick={handleBoxClick}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        className={`auth-card-panel ${!isLocked ? 'closed-floating-capsule' : 'open-auth-card'} ${isLocking ? 'locking-center' : ''}`}
        style={{
          position: 'absolute',
          left: isLocked ? '50%' : `${pos.x}px`,
          top: isLocked ? '50%' : `${pos.y}px`,
          transform: isLocked
            ? `translate(-50%, -50%) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : isLocking
            ? `translate(0, 0) scale(1.02)`
            : `none`,
          transition: isLocked ? 'transform 0.15s ease-out' : isLocking ? 'all 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          cursor: isLocked ? 'default' : 'pointer',
          zIndex: 10
        }}
      >
        {/* ========================================================
            MODE A: CLOSED FLOATING CAPSULE OBJECT (Before Click)
            ======================================================== */}
        {!isLocked && !isLocking && (
          <div className="closed-capsule-content">
            <div className="closed-capsule-badge">
              <LockIcon size={14} className="text-cyan animate-pulse" />
              <span>SECURITY CAPSULE</span>
            </div>

            <div className="auth-logo-emblem" style={{ margin: '0.6rem auto 0.4rem auto' }}>
              <div className="auth-logo-glow-ring" />
              <div className="auth-logo-badge" style={{ background: 'transparent', boxShadow: 'none' }}>
                <img src={logo} alt="Swasthya Sakha Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '12px' }} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Swasthya Sakha
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 600, marginBottom: '0.8rem' }}>
              स्वास्थ्य सखा Portal
            </div>

            <div className="closed-tap-prompt">
              <Target size={16} className="animate-pulse" style={{ color: 'var(--accent-emerald)' }} />
              <span>TAP OBJECT TO UNLOCK & OPEN 🎯</span>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE B: LOCKING CENTERING TRANSITION STATE
            ======================================================== */}
        {isLocking && (
          <div className="closed-capsule-content">
            <div className="closed-capsule-badge">
              <Zap size={14} className="text-emerald animate-spin" />
              <span>ACQUIRING & OPENING...</span>
            </div>
            <div className="auth-logo-emblem" style={{ margin: '0.8rem auto 0.6rem auto' }}>
              <div className="auth-logo-badge" style={{ transform: 'scale(1.15)' }}>
                <Activity size={32} className="animate-pulse" />
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
              Centering Auth Portal...
            </div>
          </div>
        )}

        {/* ========================================================
            MODE C: OPENED FULL AUTHENTICATION FORM (After Click)
            ======================================================== */}
        {isLocked && (
          <>
            {/* Top Close / Fold Button inside opened box */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="auth-brand-badge" style={{ marginTop: 0 }}>
                <ShieldCheck size={13} style={{ color: 'var(--primary-cyan)' }} />
                <span>Swasthya Sakha Identity Portal</span>
              </div>
              <button
                type="button"
                onClick={toggleGameMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Fold into floating capsule"
              >
                <LockIcon size={12} /> Fold
              </button>
            </div>

            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 className="auth-brand-name" style={{ fontSize: '1.4rem' }}>
                Swasthya Sakha
              </h2>
            </div>

            {/* Tab Switcher with Sliding Indicator */}
            <div className="auth-tab-container">
              <div
                className="auth-tab-indicator"
                style={{
                  transform: mode === 'login' ? 'translateX(0%)' : 'translateX(100%)'
                }}
              />

              <button
                onClick={(e) => { e.stopPropagation(); setMode('login'); setError(''); }}
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              >
                <LogIn size={15} /> Sign In
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setMode('register'); setError(''); }}
                className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              >
                <UserPlus size={15} /> Register
              </button>
            </div>

            {/* Error Callout */}
            {error && <ErrorMessage message={error} />}

            {/* SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="auth-form-animated">
                <div>
                  <label className="auth-label">Email Address</label>
                  <div className="input-box auth-input-animated">
                    <Mail size={16} style={{ color: 'var(--primary-cyan)' }} />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="citizen@health.gov.in"
                      className="chat-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-label">Password</label>
                  <div className="input-box auth-input-animated">
                    <Lock size={16} style={{ color: 'var(--primary-cyan)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="chat-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                  <Zap size={16} />
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="auth-form-animated">
                <div>
                  <label className="auth-label">Full Name</label>
                  <div className="input-box auth-input-animated">
                    <UserCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ram Kumar"
                      className="chat-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-label">Email Address</label>
                  <div className="input-box auth-input-animated">
                    <Mail size={16} style={{ color: 'var(--accent-emerald)' }} />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ram.health@odisha.gov.in"
                      className="chat-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label className="auth-label">Password</label>
                    <div className="input-box auth-input-animated" style={{ padding: '0.2rem 0.5rem' }}>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="chat-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-label">Confirm Password</label>
                    <div className="input-box auth-input-animated" style={{ padding: '0.2rem 0.5rem' }}>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="chat-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role Picker */}
                <div>
                  <label className="auth-label">User Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`role-btn ${role === 'citizen' ? 'active-citizen' : ''}`}
                    >
                      👤 Citizen
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('asha')}
                      className={`role-btn ${role === 'asha' ? 'active-asha' : ''}`}
                    >
                      🩺 ASHA Worker
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`role-btn ${role === 'doctor' ? 'active-doctor' : ''}`}
                    >
                      👨‍⚕️ Doctor
                    </button>
                  </div>
                </div>

                {/* State/District Picker */}
                <div>
                  <label className="auth-label">State / District</label>
                  <select
                    value={stateDistrict}
                    onChange={(e) => setStateDistrict(e.target.value)}
                    className="auth-select"
                  >
                    <option value="Odisha - Khurda">Odisha - Khurda</option>
                    <option value="Odisha - Cuttack">Odisha - Cuttack</option>
                    <option value="Odisha - Puri">Odisha - Puri</option>
                    <option value="Delhi - NCT">Delhi - NCT</option>
                    <option value="West Bengal - Kolkata">West Bengal - Kolkata</option>
                    <option value="Maharashtra - Mumbai">Maharashtra - Mumbai</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                  <span>{loading ? 'Registering Account...' : 'Create Account & Enter'}</span>
                  <Zap size={16} />
                </button>
              </form>
            )}

            {/* Third-Party Google Auth Button with Official Colored Google Icon */}
            <div style={{ marginTop: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="glass-panel auth-google-btn"
              >
                {/* Official Colored Google Icon SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span style={{ fontWeight: 600 }}>Sign In with Google</span>
              </button>
            </div>

            {/* QUICK DEMO EVALUATION SHORTCUTS */}
            <div style={{ marginTop: '1rem', paddingTop: '0.7rem', borderTop: '1px solid var(--border-glass)' }}>
              <div className="auth-demo-badge">
                <Sparkles size={13} style={{ color: 'var(--primary-cyan)' }} /> SIH Evaluator Quick Demo Profiles
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  onClick={() => handleQuickDemoLogin('citizen')}
                  className="auth-demo-card demo-citizen"
                >
                  <div>
                    <strong>Ram Kumar</strong>
                  </div>
                  <span className="demo-arrow">Demo →</span>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('asha')}
                  className="auth-demo-card demo-asha"
                >
                  <div>
                    <strong>Sunita Devi</strong>
                  </div>
                  <span className="demo-arrow">Demo →</span>
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Gamified Closed Capsule & Morphing Styling */}
      <style>{`
        /* Closed Floating Capsule vs Open Auth Card */
        .auth-card-panel {
          box-sizing: border-box;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(15, 23, 42, 0.88);
          box-shadow: 0 18px 45px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2);
          overflow: hidden;
          will-change: transform, left, top, width, height, padding;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.4s ease, background 0.3s ease, border-color 0.3s ease;
        }

        /* Light Theme Auth Card & Element Overrides */
        [data-theme="light"] .auth-card-panel {
          background: rgba(255, 255, 255, 0.94) !important;
          border: 1px solid rgba(2, 132, 199, 0.35) !important;
          box-shadow: 0 18px 45px -10px rgba(2, 132, 199, 0.2), 0 0 30px rgba(2, 132, 199, 0.15) !important;
        }

        [data-theme="light"] .closed-floating-capsule {
          border: 2px solid #0284c7 !important;
          box-shadow: 0 0 35px rgba(2, 132, 199, 0.5), 0 0 70px rgba(5, 150, 105, 0.25) !important;
        }

        [data-theme="light"] .auth-tab-container {
          background: rgba(241, 245, 249, 0.95) !important;
          border: 1px solid rgba(148, 163, 184, 0.35) !important;
        }

        [data-theme="light"] .auth-tab-btn {
          color: #475569 !important;
        }

        [data-theme="light"] .auth-tab-btn.active {
          color: #ffffff !important;
        }

        [data-theme="light"] .auth-label {
          color: #334155 !important;
          font-weight: 600;
        }

        [data-theme="light"] .auth-input-animated,
        [data-theme="light"] .auth-select {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
        }

        [data-theme="light"] .chat-input {
          color: #0f172a !important;
        }

        [data-theme="light"] .chat-input::placeholder {
          color: #94a3b8 !important;
        }

        [data-theme="light"] .role-btn {
          background: #f1f5f9 !important;
          border: 1px solid #cbd5e1 !important;
          color: #334155 !important;
        }

        [data-theme="light"] .role-btn.active-citizen {
          background: rgba(2, 132, 199, 0.12) !important;
          border-color: #0284c7 !important;
          color: #0284c7 !important;
        }

        [data-theme="light"] .role-btn.active-asha {
          background: rgba(5, 150, 105, 0.12) !important;
          border-color: #059669 !important;
          color: #059669 !important;
        }

        [data-theme="light"] .role-btn.active-doctor {
          background: rgba(217, 119, 6, 0.12) !important;
          border-color: #d97706 !important;
          color: #d97706 !important;
        }

        [data-theme="light"] .auth-google-btn {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        [data-theme="light"] .auth-demo-card {
          color: #0f172a !important;
        }

        [data-theme="light"] .demo-citizen {
          background: rgba(2, 132, 199, 0.08) !important;
          border: 1px solid rgba(2, 132, 199, 0.3) !important;
        }

        [data-theme="light"] .demo-asha {
          background: rgba(5, 150, 105, 0.08) !important;
          border: 1px solid rgba(5, 150, 105, 0.3) !important;
        }

        .closed-floating-capsule {
          width: 250px;
          padding: 1.1rem 1rem;
          border: 2px solid var(--primary-cyan) !important;
          border-radius: 28px;
          box-shadow: 0 0 35px rgba(6, 182, 212, 0.6), 0 0 70px rgba(52, 211, 153, 0.25) !important;
          text-align: center;
          animation: capsulePulse 2s ease-in-out infinite alternate;
        }

        .closed-floating-capsule:hover {
          box-shadow: 0 0 50px rgba(6, 182, 212, 0.95), 0 0 90px rgba(52, 211, 153, 0.4) !important;
          transform: scale(1.04);
        }

        .open-auth-card {
          width: 100%;
          max-width: 390px;
          padding: 1.5rem 1.4rem;
          border: 1px solid rgba(6, 182, 212, 0.35);
          border-radius: 22px;
          animation: openUnfold 0.5s ease-out forwards;
        }

        @keyframes capsulePulse {
          0% { border-color: rgba(6, 182, 212, 0.7); }
          100% { border-color: rgba(52, 211, 153, 1); }
        }

        @keyframes openUnfold {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .closed-capsule-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.25rem 0.65rem;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--primary-cyan);
          letter-spacing: 0.5px;
        }

        .closed-tap-prompt {
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #fff;
          padding: 0.45rem 0.6rem;
          border-radius: 12px;
          font-size: 0.74rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
        }

        /* Compact Logo Emblem */
        .auth-logo-emblem {
          margin: 0 auto 0.5rem auto;
          width: 48px;
          height: 48px;
          position: relative;
        }

        .auth-logo-glow-ring {
          position: absolute;
          inset: -6px;
          border-radius: 16px;
          background: var(--primary-gradient);
          opacity: 0.4;
          filter: blur(10px);
          animation: pulseRing 2.5s infinite ease-in-out;
        }

        .auth-logo-badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
          position: relative;
          z-index: 2;
        }

        .auth-logo-icon {
          animation: heartBeat 2.2s infinite ease-in-out;
        }

        .auth-brand-name {
          font-size: 1.45rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-brand-badge {
          font-size: 0.76rem;
          color: var(--primary-cyan);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        /* Tab Switcher & Sliding Indicator */
        .auth-tab-container {
          position: relative;
          display: flex;
          background: rgba(30, 41, 59, 0.85);
          padding: 3px;
          border-radius: 12px;
          margin-bottom: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auth-tab-indicator {
          position: absolute;
          top: 3px;
          left: 3px;
          width: calc(50% - 3px);
          height: calc(100% - 6px);
          border-radius: 9px;
          background: var(--primary-gradient);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }

        .auth-tab-btn {
          flex: 1;
          padding: 0.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          position: relative;
          z-index: 2;
        }

        .auth-tab-btn.active {
          color: #fff;
        }

        /* Form Controls */
        .auth-form-animated {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          animation: formFade 0.4s ease-out forwards;
        }

        @keyframes formFade {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .auth-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 3px;
          font-weight: 500;
        }

        .auth-input-animated {
          transition: all 0.25s ease;
          padding: 0.35rem 0.55rem 0.35rem 0.9rem;
        }

        .auth-input-animated:focus-within {
          border-color: var(--primary-cyan) !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3) !important;
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: 0.3rem;
          padding: 0.75rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
        }

        .role-btn {
          padding: 0.45rem 0.25rem;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
          background: rgba(30, 41, 59, 0.6);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .role-btn.active-citizen {
          border-color: var(--primary-cyan);
          background: rgba(6, 182, 212, 0.18);
          color: var(--primary-cyan);
        }

        .role-btn.active-asha {
          border-color: var(--accent-emerald);
          background: rgba(16, 185, 129, 0.18);
          color: var(--accent-emerald);
        }

        .role-btn.active-doctor {
          border-color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.18);
          color: var(--accent-amber);
        }

        .auth-select {
          width: 100%;
          padding: 0.55rem 0.7rem;
          border-radius: 10px;
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          font-size: 0.82rem;
          outline: none;
        }

        .auth-google-btn {
          width: 100%;
          padding: 0.65rem;
          cursor: pointer;
          color: #fff;
          font-size: 0.86rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 10px;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .auth-demo-badge {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--primary-cyan);
          margin-bottom: 0.45rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .auth-demo-card {
          padding: 0.45rem 0.65rem;
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.76rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .demo-citizen {
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        .demo-asha {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .demo-arrow {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--primary-cyan);
        }
      `}</style>
    </div>
  );
};

export default Auth;
