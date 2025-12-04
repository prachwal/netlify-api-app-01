import React from 'react';
import { Button } from '../general/Button';

interface TopbarProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar?: () => void;
}

const MOBILE_BREAKPOINT = 768;

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  onToggleMobileSidebar
}) => {
  const handleToggleSidebar = () => {
    // On mobile, toggle mobile sidebar; on desktop, toggle collapse
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      onToggleMobileSidebar?.();
    } else {
      onToggleSidebar();
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <Button
          variant="ghost"
          size="small"
          onClick={handleToggleSidebar}
          className="topbar__sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          ☰
        </Button>
        
        <h1 className="topbar__title">Dashboard</h1>
      </div>

      <div className="topbar__center">
        <div className="topbar__search">
          <input
            type="search"
            placeholder="Search..."
            className="topbar__search-input"
            aria-label="Search dashboard"
          />
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__notifications">
          <Button
            variant="ghost"
            size="small"
            className="topbar__notification-button"
            aria-label="Notifications"
          >
            🔔
            <span className="topbar__notification-badge">3</span>
          </Button>
        </div>
        
        <div className="topbar__user-menu">
          <Button
            variant="ghost"
            size="small"
            className="topbar__user-button"
            aria-label="User menu"
          >
            👤
          </Button>
        </div>
      </div>
    </header>
  );
};
