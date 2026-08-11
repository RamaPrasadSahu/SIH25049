import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children, onNewChat, showSidebar }) => {
  // Mobile auto-collapse: close sidebar by default on screen width <= 768px
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Show sidebar ONLY on chat page (/chat) or if showSidebar prop is explicitly true
  const isSidebarVisible = showSidebar !== undefined ? showSidebar : location.pathname === '/chat';

  return (
    <div className="app-layout">
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarVisible && sidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      {isSidebarVisible && (
        <Sidebar isOpen={sidebarOpen} onNewChat={onNewChat} onCloseMobile={closeSidebar} />
      )}

      <div className="main-content">
        <Navbar onToggleSidebar={toggleSidebar} showSidebarToggle={isSidebarVisible} />
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
