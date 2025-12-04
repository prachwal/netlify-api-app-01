// components/general/Button/Button.test.tsx - Button component tests

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/preact';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    renderWithProviders(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeTruthy();
    expect(button.className).toContain('button');
    expect(button.className).toContain('button--primary');
    expect(button.className).toContain('button--medium');
  });

  it('renders with different variants', () => {
    const { rerender } = renderWithProviders(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button').className).toContain('button--primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('button--secondary');
    
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button').className).toContain('button--danger');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('button--ghost');
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithProviders(<Button size="small">Small</Button>);
    expect(screen.getByRole('button').className).toContain('button--small');
    
    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button').className).toContain('button--medium');
    
    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button').className).toContain('button--large');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBeTruthy();
    expect(button.className).toContain('button--disabled');
  });

  it('shows loading state', () => {
    renderWithProviders(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBeTruthy();
    expect(button.className).toContain('button--loading');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('forwards additional props', () => {
    renderWithProviders(
      <Button 
        data-testid="custom-button" 
        aria-label="Custom button"
        type="submit"
      >
        Custom
      </Button>
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button.getAttribute('aria-label')).toBe('Custom button');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('applies custom className', () => {
    renderWithProviders(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });
});