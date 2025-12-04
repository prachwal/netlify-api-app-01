import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardContent } from './DashboardContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigateToSection?: (section: string) => void;
}

/**
 * DashboardLayout - Main layout component for the dashboard
 * 
 * @remarks
 * Provides responsive layout with sidebar navigation and topbar
 * Mobile-first design with collapsible sidebar
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onNavigateToSection }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarOpen}
        onToggleCollapse={toggleSidebar}
        onCloseMobile={closeMobileSidebar}
        onNavigateToSection={onNavigateToSection ?? (() => {})}
      />
      
      <div className="dashboard-layout__main">
        <Topbar
          onToggleSidebar={toggleSidebar}
        />
        
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
};
