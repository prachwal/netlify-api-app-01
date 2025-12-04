// main.tsx - Application entry point with Redux Provider

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './styles/main.scss';

/**
 * Main application entry point
 * 
 * @remarks
 * Configures Redux Provider and renders the main App component.
 * This is the root of the React application tree.
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
