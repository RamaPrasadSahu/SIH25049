import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { Landing } from './pages/Landing';
import { Chat } from './pages/Chat';
import { Dashboard } from './pages/Dashboard';
import { Login, Register } from './pages/Login';
import { Auth } from './pages/Auth';
import { Splash } from './pages/Splash';
import { Profile, History } from './pages/Profile';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <ChatProvider>
            <Router>
              <Routes>
                {/* First: Splash Intro */}
                <Route path="/" element={<Splash />} />
                <Route path="/splash" element={<Splash />} />
                
                {/* Second: Authentication */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Third: Home Screen & Main Application */}
                <Route path="/home" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
                
                {/* Fallback to Splash Intro */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ChatProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
