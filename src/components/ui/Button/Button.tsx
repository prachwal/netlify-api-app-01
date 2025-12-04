// components/ui/Button/Button.tsx - Modern atomic Button component
import React, { forwardRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Icon before text */
  leadingIcon?: React.ReactNode;
  /** Icon after text */
  trailingIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leadingIcon,
      trailingIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      loading && styles['button--loading'],
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled ?? loading}
        {...props}
      >
        {leadingIcon && (
          <span className={styles.button__icon} aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        {children && (
          <span className={styles.button__text}>
            {children}
          </span>
        )}

        {trailingIcon && (
          <span className={styles.button__icon} aria-hidden="true">
            {trailingIcon}
          </span>
        )}

        {loading && (
          <span className={styles.button__spinner} aria-hidden="true">
            <svg
              className={styles.button__spinnerIcon}
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="25 25"
                strokeDashoffset="25"
                className={styles.button__spinnerCircle}
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
