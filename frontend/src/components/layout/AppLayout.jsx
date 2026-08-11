import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children, onNewChat, showSidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Show sidebar ONLY on chat page (/chat) or if showSidebar prop is explicitly true
  const isSidebarVisible = showSidebar !== undefined ? showSidebar : location.pathname === '/chat';

  return (
    <div className="app-layout">
      {isSidebarVisible && <Sidebar isOpen={sidebarOpen} onNewChat={onNewChat} />}
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
