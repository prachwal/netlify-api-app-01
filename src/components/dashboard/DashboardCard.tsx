import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  icon?: string;
  subtitle?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className = '',
  headerActions,
  icon,
  subtitle
}) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card__header">
        <div className="dashboard-card__title-section">
          {icon && (
            <span className="dashboard-card__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="dashboard-card__title-wrapper">
            <h3 className="dashboard-card__title">{title}</h3>
            {subtitle && (
              <p className="dashboard-card__subtitle">{subtitle}</p>
            )}
          </div>
        </div>
        {headerActions && (
          <div className="dashboard-card__actions">
            {headerActions}
          </div>
        )}
      </div>
      
      <div className="dashboard-card__content">
        {children}
      </div>
    </div>
  );
};
