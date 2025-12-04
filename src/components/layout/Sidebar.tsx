import React from 'react';
import { Button } from '../general/Button';

interface NavItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onNavigateToSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onNavigateToSection
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', active: true },
    { id: 'counter', label: 'Counter', active: false },
    { id: 'api-demo', label: 'API Demo', active: false },
    { id: 'features', label: 'Features', active: false },
    { id: 'settings', label: 'Settings', active: false },
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="sidebar__overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={`
          sidebar
          ${collapsed ? 'sidebar--collapsed' : ''}
          ${mobileOpen ? 'sidebar--mobile-open' : ''}
        `}
      >
        <div className="sidebar__header">
          <div className="sidebar__logo">
            {!collapsed ? (
              <h2 className="sidebar__title">Dashboard</h2>
            ) : (
              <div className="sidebar__logo-icon">📊</div>
            )}
          </div>
          
          <div className="sidebar__header-actions">
            <Button
              variant="ghost"
              size="small"
              onClick={onCloseMobile}
              className="sidebar__close-button"
              aria-label="Close sidebar"
            >
              ✕
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={onToggleCollapse}
              className="sidebar__collapse-button"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '→' : '←'}
            </Button>
          </div>
        </div>

        <nav className="sidebar__nav" role="navigation">
          <ul className="sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="sidebar__nav-item">
                <button
                  className={`
                    sidebar__nav-button
                    ${item.active === true ? 'sidebar__nav-button--active' : ''}
                  `}
                  onClick={() => {
                    onNavigateToSection(item.id);
                    onCloseMobile();
                  }}
                  aria-current={item.active === true ? 'page' : undefined}
                >
                  {item.icon !== undefined && item.icon !== '' && (
                    <span className="sidebar__nav-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {!collapsed && (
                    <span className="sidebar__nav-label">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          {!collapsed ? (
            <div className="sidebar__user">
              <div className="sidebar__user-avatar">👤</div>
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">Admin User</div>
                <div className="sidebar__user-email">admin@example.com</div>
              </div>
            </div>
          ) : (
            <div className="sidebar__user-compact">👤</div>
          )}
        </div>
      </aside>
    </>
  );
};
