// test/preact.tsx - Preact-specific testing utilities

import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that includes providers
 * @param ui - Component to render
 * @param options - Render options
 * @returns Testing library render result
 */
export function renderWithProviders(ui: ReactElement, options?: Parameters<typeof render>[1]) {
  return render(ui, options);
}

