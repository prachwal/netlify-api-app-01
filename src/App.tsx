// App.tsx - Main application component with Redux and RTK Query integration

import React, { useState, Component } from 'react';
import type { ErrorInfo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { increment, decrement, reset } from './store/slices/counterSlice';
import { useGetHelloQuery, useEchoMessageMutation, useGetApiInfoQuery } from './store';
import { HeaderSection, CounterSection, ApiDemoSection, FeaturesSection } from './components/sections';

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
 * Main application component
 *
 * @remarks
 * This component demonstrates the integration of:
 * - Redux Toolkit for state management
 * - RTK Query for API handling
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
  
  // RTK Query hooks
  const { data: helloMessage, isLoading: helloLoading } = useGetHelloQuery();
  const { data: apiInfo, isLoading: apiInfoLoading } = useGetApiInfoQuery();
  const [echoMessage, { data: echoData, isLoading: echoLoading, error: echoError }] = useEchoMessageMutation();
  const [messageToEcho, setMessageToEcho] = useState('Hello from frontend!');

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
    <ErrorBoundary>
      <div className="app">
        <HeaderSection />

        <main className="app__main">
          <CounterSection
            value={value}
            status={status}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onReset={handleReset}
          />

          <ApiDemoSection
            helloMessage={helloMessage}
            helloLoading={helloLoading}
            apiInfo={apiInfo}
            apiInfoLoading={apiInfoLoading}
            echoMessage={echoMessage}
            echoData={echoData}
            echoLoading={echoLoading}
            echoError={echoError}
            messageToEcho={messageToEcho}
            onMessageChange={setMessageToEcho}
          />

          <FeaturesSection />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
