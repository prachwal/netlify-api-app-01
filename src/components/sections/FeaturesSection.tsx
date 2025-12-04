import React from 'react';

/**
 * Features section component
 *
 * @remarks
 * Displays the project features list
 *
 * @returns Rendered features section
 */
const FeaturesSection: React.FC = () => {
  return (
    <section className="app__section">
      <div className="features">
        <h2 className="features__title">Project Features</h2>
        <ul className="features__list">
          <li className="features__item">
            ✅ <strong>Redux Toolkit</strong> - Modern Redux with TypeScript
          </li>
          <li className="features__item">
            ✅ <strong>RTK Query</strong> - Advanced API data fetching with caching
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
          <li className="features__item">
            ✅ <strong>Shared Libraries</strong> - Reusable components in netlify/libs
          </li>
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;