// App.tsx - Main application component with Redux integration

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { increment, decrement, reset } from './store/slices/counterSlice';
import { Button } from './components/general/Button';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';

/**
 * Main application component
 *
 * @remarks
 * This component demonstrates the integration of:
 * - Redux Toolkit for state management
 * - SCSS module styling
 * - TypeScript interfaces
 * - Modern React patterns
 *
 * @returns Rendered application component
 */
const App: React.FC = () => {
  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const { value, status } = useSelector((state: RootState) => state.counter);

  /**
   * Handle increment button click
   */
  const handleIncrement = (): void => {
    dispatch(increment());
  };

  /**
   * Handle decrement button click
   */
  const handleDecrement = (): void => {
    dispatch(decrement());
  };

  /**
   * Handle reset button click
   */
  const handleReset = (): void => {
    dispatch(reset());
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__logo-container">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="app__logo" alt="Vite logo" width="64" height="64" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img
              src={reactLogo}
              className="app__logo app__logo--react"
              alt="React logo"
              width="64"
              height="64"
            />
          </a>
        </div>
        <h1 className="app__title">Vite + React + Redux</h1>
        <p className="app__subtitle">
          Enhanced with TypeScript, SCSS, TSDoc, ESLint, Prettier, and Vitest
        </p>
      </header>

      <main className="app__main">
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
                  onClick={handleIncrement}
                  disabled={status === 'loading'}
                >
                  Increment
                </Button>

                <Button
                  variant="secondary"
                  size="medium"
                  onClick={handleDecrement}
                  disabled={status === 'loading'}
                >
                  Decrement
                </Button>

                <Button
                  variant="danger"
                  size="medium"
                  onClick={handleReset}
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

        <section className="app__section">
          <div className="features">
            <h2 className="features__title">Project Features</h2>
            <ul className="features__list">
              <li className="features__item">
                ✅ <strong>Redux Toolkit</strong> - Modern Redux with TypeScript
              </li>
              <li className="features__item">
                ✅ <strong>SCSS Architecture</strong> - 7-1 pattern with modern @use/@forward
              </li>
              <li className="features__item">
                ✅ <strong>TSDoc</strong> - Comprehensive API documentation
              </li>
              <li className="features__item">
                ✅ <strong>ESLint</strong> - TypeScript-aware linting rules
              </li>
              <li className="features__item">
                ✅ <strong>Prettier</strong> - Consistent code formatting
              </li>
              <li className="features__item">
                ✅ <strong>Vitest</strong> - Fast unit testing with coverage
              </li>
              <li className="features__item">
                ✅ <strong>Component Architecture</strong> - Organized by scope (general, layout,
                app)
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
