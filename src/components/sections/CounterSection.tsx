import React from 'react';
import { Button } from '../../components/general/Button';

/**
 * Props for CounterSection component
 */
interface CounterSectionProps {
  /** Current counter value */
  value: number;
  /** Current status of the counter */
  status: string;
  /** Handler for increment button */
  onIncrement: () => void;
  /** Handler for decrement button */
  onDecrement: () => void;
  /** Handler for reset button */
  onReset: () => void;
}

/**
 * Counter section component
 *
 * @remarks
 * Displays the Redux counter with increment, decrement, and reset controls
 *
 * @param props - Component props
 * @returns Rendered counter section
 */
const CounterSection: React.FC<CounterSectionProps> = ({
  value,
  status,
  onIncrement,
  onDecrement,
  onReset,
}) => {
  return (
    <section className="app__section">
      <div className="card">
        <h2 className="card__title">Redux Counter</h2>
        <div className="counter">
          <div className="counter__display">
            <span className="counter__value">Count is {value}</span>
            {status !== 'idle' && <span className="counter__status">Status: {status}</span>}
          </div>

          <div className="counter__controls">
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
        </div>

        <p className="card__description">
          Edit <code className="card__code">src/App.tsx</code> and save to test Redux state
          management with TypeScript.
        </p>
      </div>
    </section>
  );
};

export default CounterSection;