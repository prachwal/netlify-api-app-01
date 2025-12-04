import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardContent } from './DashboardContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigateToSection?: (section: string) => void;
}

const MOBILE_BREAKPOINT = 768;

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

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Handle ESC key to close mobile sidebar
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        closeMobileSidebar();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [sidebarOpen]);

  // Close mobile sidebar on window resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT && sidebarOpen) {
        closeMobileSidebar();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          onToggleMobileSidebar={toggleMobileSidebar}
        />
        
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
};
