import React from 'react';

interface DashboardContentProps {
  children: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  return (
    <main className="dashboard-content">
      <div className="dashboard-content__container">
        {children}
      </div>
    </main>
  );
};
