import React from 'react';
import { DashboardCard } from './DashboardCard';
import { Button } from '../general/Button';

interface DashboardCounterCardProps {
  value: number;
  status: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export const DashboardCounterCard: React.FC<DashboardCounterCardProps> = ({
  value,
  status,
  onIncrement,
  onDecrement,
  onReset,
}) => {
  return (
    <DashboardCard
      title="Redux Counter"
      subtitle="State management demonstration"
      icon="🔢"
      className="dashboard-card--half-width"
    >
      <div className="dashboard-counter">
        <div className="dashboard-counter__display">
          <div className="dashboard-counter__value">
            Count is {value}
          </div>
          {status !== 'idle' && (
            <div className="dashboard-counter__status">
              Status: {status}
            </div>
          )}
        </div>

        <div className="dashboard-counter__controls">
          <Button
            variant="primary"
            size="medium"
            onClick={onIncrement}
            disabled={status === 'loading'}
          >
            Increment
          </Button>

          <Button
            variant="secondary"
            size="medium"
            onClick={onDecrement}
            disabled={status === 'loading'}
          >
            Decrement
          </Button>

          <Button
            variant="danger"
            size="medium"
            onClick={onReset}
            disabled={value === 0 || status === 'loading'}
          >
            Reset
          </Button>
        </div>

        <div className="dashboard-counter__description">
          Edit <code className="dashboard-counter__code">src/App.tsx</code> and save to test Redux state
          management with TypeScript.
        </div>
      </div>
    </DashboardCard>
  );
};
