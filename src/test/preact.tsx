// test/preact.tsx - Preact-specific testing utilities

import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that includes providers
 * @param ui - Component to render
 * @param options - Render options
 * @returns Testing library render result
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Parameters<typeof render>[1]
) {
  return render(ui, options);
}

/**
 * Mock implementation for async components
 * @param component - Component to render
 * @returns Promise resolving to rendered component
 */
export async function renderAsync<T extends HTMLElement>(
  component: ReactElement
): Promise<{ container: T; unmount: () => void }> {
  return new Promise((resolve) => {
    const result = renderWithProviders(component);
    resolve({
      container: result.container as T,
      unmount: result.unmount
    });
  });
}