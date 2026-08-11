import React, { createContext, useContext, useState, useEffect } from 'react';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('swasthya_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('swasthya_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const logo = theme === 'light' ? logoLight : logoDark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, logo, logoLight, logoDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
