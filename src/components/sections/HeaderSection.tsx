import React from 'react';
import viteLogo from '/vite.svg';
import reactLogo from '../../assets/react.svg';

/**
 * Header section component
 *
 * @remarks
 * Displays the application header with logos and title
 *
 * @returns Rendered header section
 */
const HeaderSection: React.FC = () => {
  return (
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
  );
};

export default HeaderSection;