// components/general/Button/Button.tsx - General Button component

import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

/**
 * Button component props interface
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether the button is in loading state */
  loading?: boolean;
  
  /** Icon to display before text */
  icon?: ReactNode;
  
  /** Icon to display after text */
  iconRight?: ReactNode;
}

/**
 * General purpose Button component
 * 
 * @remarks
 * This component supports multiple variants, sizes, and states.
 * Provides proper accessibility attributes and keyboard navigation.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 * 
 * @param props - Component props
 * @returns Rendered button element
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  icon,
  iconRight,
  className,
  ...props
}) => {
  const baseClasses = styles.button;
  const variantClasses = styles[`button--${variant}` as keyof typeof styles];
  const sizeClasses = styles[`button--${size}` as keyof typeof styles];
  const stateClasses = [
    loading === true && styles['button--loading'],
    disabled === true && styles['button--disabled'],
  ].filter(Boolean).join(' ');

  const combinedClassName = [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClassName}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className={styles.button__spinner} aria-hidden="true">
          <svg className={styles.spinner} viewBox="0 0 24 24">
            <circle
              className={styles.spinner__path}
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
          </svg>
        </span>
      )}
      {icon != null && loading !== true && (
        <span className={`${styles.button__icon} ${styles['button__icon--left']}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.button__content}>{children}</span>
      {iconRight != null && (
        <span className={`${styles.button__icon} ${styles['button__icon--right']}`} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
};