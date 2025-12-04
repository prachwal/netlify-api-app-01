// App.tsx - Main application component with Redux and RTK Query integration

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { increment, decrement, reset } from './store/slices/counterSlice';
import { useGetHelloQuery, useEchoMessageMutation, useGetApiInfoQuery } from './store';
import { HeaderSection, CounterSection, ApiDemoSection, FeaturesSection } from './components/sections';

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
  const [echoMessage, { data: echoData, isLoading: echoLoading }] = useEchoMessageMutation();
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
          messageToEcho={messageToEcho}
          onMessageChange={setMessageToEcho}
        />

        <FeaturesSection />
      </main>
    </div>
  );
};

export default App;
