// App.tsx - Main application component with Redux and RTK Query integration

import React, { useState, Component } from 'react';
import type { ErrorInfo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { increment, decrement, reset } from './store/slices/counterSlice';
import { useGetHelloQuery, useEchoMessageMutation, useGetApiInfoQuery } from './store';

/**
 * Navigation section types
 */
export type Section = 'dashboard' | 'counter' | 'api-demo' | 'features' | 'settings';

// Dashboard Components
import { DashboardLayout } from './components/layout';
import { DashboardCounterCard } from './components/dashboard';
import { DashboardCard } from './components/dashboard';
import { Button } from './components/general/Button';

/**
 * Error Boundary component for catching React errors
 */
class ErrorBoundary extends Component<React.PropsWithChildren<{}>, { hasError: boolean; error?: Error }> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" data-testid="error-boundary">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">An error occurred while rendering the application.</p>
          <button
            className="error-boundary__retry-button"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main application component with Dashboard layout
 */
const App: React.FC = () => {
  // Navigation state
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const { value, status } = useSelector((state: RootState) => state.counter);

  // RTK Query hooks
  const { data: helloMessage, isLoading: helloLoading } = useGetHelloQuery();
  const { data: apiInfo, isLoading: apiInfoLoading } = useGetApiInfoQuery();
  const [echoMessage, { data: echoData, isLoading: echoLoading, error: echoError }] = useEchoMessageMutation();
  const [messageToEcho, setMessageToEcho] = useState('Hello from frontend!');

  /**
   * Handle navigation to different sections
   */
  const handleNavigateToSection = (section: string): void => {
    setCurrentSection(section as Section);
  };

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

  /**
   * Handle echo message submission
   */
  const handleEchoSubmit = (): void => {
    if (!messageToEcho.trim()) {
      return; // Don't send empty messages
    }

    echoMessage({
      message: messageToEcho.trim(),
      data: { timestamp: new Date().toISOString() }
    });
  };

  /**
   * Get error message for display - improved RTK Query error handling
   */
  const getErrorMessage = (): string => {
    if (!echoError) return 'Unknown error';

    // Handle Error instances first (before object check to satisfy TypeScript)
    if ((echoError as any) instanceof Error) {
      return (echoError as Error).message;
    }

    // Handle RTK Query error format
    if (typeof echoError === 'object' && echoError !== null) {
      const error = echoError as any;

      // Try common RTK Query error properties
      if (typeof error.message === 'string') {
        return error.message;
      }

      if (error.error != null) {
        return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
      }

      if (error.data) {
        if (typeof error.data === 'string') {
          return error.data;
        }
        if (error.data.message) {
          return error.data.message;
        }
        return JSON.stringify(error.data);
      }

      if (error.status) {
        return `HTTP ${error.status}: ${error.statusText ?? 'Request failed'}`;
      }

      // Fallback to stringifying the object
      return JSON.stringify(error, null, 2);
    }

    // Handle string errors
    if (typeof echoError === 'string') {
      return echoError;
    }

    // Final fallback
    return String(echoError);
  };

  return (
    <ErrorBoundary>
      <DashboardLayout onNavigateToSection={handleNavigateToSection}>
        {currentSection === 'dashboard' && (
          <div className="dashboard-grid">
          {/* Counter Dashboard Card */}
          <DashboardCounterCard
            value={value}
            status={status}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onReset={handleReset}
          />

          {/* API Demo Dashboard Card */}
          <DashboardCard
            title="API Demo with RTK Query"
            subtitle="Demonstration of API data fetching and state management"
            icon="🌐"
            className="dashboard-card--half-width"
          >
            <div className="dashboard-api-demo">
              {/* Hello Message Section */}
              <div className="dashboard-api-demo__section">
                <h4 className="dashboard-api-demo__title">Hello API</h4>
                {helloLoading ? (
                  <p className="dashboard-api-demo__status">Loading hello message...</p>
                ) : helloMessage != null ? (
                  <p className="dashboard-api-demo__response">{helloMessage}</p>
                ) : (
                  <p className="dashboard-api-demo__error">Failed to load hello message</p>
                )}
              </div>

              {/* API Information Section */}
              <div className="dashboard-api-demo__section">
                <h4 className="dashboard-api-demo__title">API Information</h4>
                {apiInfoLoading ? (
                  <p className="dashboard-api-demo__status">Loading API info...</p>
                ) : apiInfo ? (
                  <div className="dashboard-api-demo__info">
                    <div className="dashboard-api-demo__item">
                      <strong>Name:</strong> {apiInfo.name}
                    </div>
                    <div className="dashboard-api-demo__item">
                      <strong>Version:</strong> {apiInfo.version}
                    </div>
                    <div className="dashboard-api-demo__item">
                      <strong>Description:</strong> {apiInfo.description}
                    </div>
                    <div className="dashboard-api-demo__item">
                      <strong>Features:</strong> {apiInfo.features.join(', ')}
                    </div>
                  </div>
                ) : (
                  <p className="dashboard-api-demo__error">Failed to load API info</p>
                )}
              </div>

              {/* Echo Message Form */}
              <div className="dashboard-api-demo__section">
                <h4 className="dashboard-api-demo__title">Echo Message</h4>
                <div className="dashboard-api-demo__form">
                  <input
                    type="text"
                    value={messageToEcho}
                    onChange={(e) => setMessageToEcho(e.target.value)}
                    placeholder="Enter a message to echo"
                    className="dashboard-api-demo__input"
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleEchoSubmit}
                    disabled={echoLoading}
                  >
                    {echoLoading ? 'Sending...' : 'Send Echo'}
                  </Button>
                </div>

                {echoError ? (
                  <div className="dashboard-api-demo__error">
                    Error: {getErrorMessage()}
                  </div>
                ) : null}

                {echoData && (
                  <div className="dashboard-api-demo__echo-response">
                    <div className="dashboard-api-demo__item">
                      <strong>Original:</strong> {echoData.originalMessage}
                    </div>
                    {echoData.receivedData != null && (
                      <div className="dashboard-api-demo__item">
                        <strong>Received data:</strong> {JSON.stringify(echoData.receivedData)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DashboardCard>

          {/* Features Dashboard Card */}
          <DashboardCard
            title="Project Features"
            subtitle="Modern React application stack and technologies"
            icon="✨"
            className="dashboard-card--full-width"
          >
            <div className="dashboard-features">
              <ul className="dashboard-features__list">
                <li className="dashboard-features__item">
                  ✅ <strong>Redux Toolkit</strong> - Modern Redux with TypeScript
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>RTK Query</strong> - Advanced API data fetching with caching
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>SCSS Architecture</strong> - 7-1 pattern with modern @use/@forward
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>TSDoc</strong> - Comprehensive API documentation
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>ESLint</strong> - TypeScript-aware linting rules
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>Prettier</strong> - Consistent code formatting
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>Vitest</strong> - Fast unit testing with coverage
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>Component Architecture</strong> - Organized by scope (general, layout, dashboard)
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>Responsive Design</strong> - Mobile-first approach with CSS clamp() functions
                </li>
                <li className="dashboard-features__item">
                  ✅ <strong>Dashboard Layout</strong> - Professional sidebar navigation with collapsible design
                </li>
              </ul>
            </div>
          </DashboardCard>
          </div>
        )}

        {currentSection === 'counter' && (
          <div className="dashboard-grid">
            <DashboardCounterCard
              value={value}
              status={status}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onReset={handleReset}
            />
            <DashboardCard
              title="Counter Section"
              subtitle="Focused counter interface"
              icon="🔢"
              className="dashboard-card--full-width"
            >
              <p>Counter section content</p>
            </DashboardCard>
          </div>
        )}

        {currentSection === 'api-demo' && (
          <div className="dashboard-grid">
            <DashboardCard
              title="API Demo with RTK Query"
              subtitle="Demonstration of API data fetching and state management"
              icon="🌐"
              className="dashboard-card--full-width"
            >
              <div className="dashboard-api-demo">
                {/* Hello Message Section */}
                <div className="dashboard-api-demo__section">
                  <h4 className="dashboard-api-demo__title">Hello API</h4>
                  {helloLoading ? (
                    <p className="dashboard-api-demo__status">Loading hello message...</p>
                  ) : helloMessage != null ? (
                    <p className="dashboard-api-demo__response">{helloMessage}</p>
                  ) : (
                    <p className="dashboard-api-demo__error">Failed to load hello message</p>
                  )}
                </div>
              </div>
            </DashboardCard>
          </div>
        )}

        {currentSection === 'features' && (
          <div className="dashboard-grid">
            <DashboardCard
              title="Project Features"
              subtitle="Modern React application stack and technologies"
              icon="✨"
              className="dashboard-card--full-width"
            >
              <div className="dashboard-features">
                <p>Features section content</p>
              </div>
            </DashboardCard>
          </div>
        )}

        {currentSection === 'settings' && (
          <div className="dashboard-grid">
            <DashboardCard
              title="Settings"
              subtitle="Application configuration"
              icon="⚙️"
              className="dashboard-card--full-width"
            >
              <p>Settings section content</p>
            </DashboardCard>
          </div>
        )}
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default App;
