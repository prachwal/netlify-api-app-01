// components/ui/Card/Card.tsx - Modern atomic Card component
import React, { forwardRef } from 'react';
import styles from './Card.module.scss';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface CardSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual elevation/shadow */
  elevation?: 'none' | 'low' | 'medium' | 'high';
  /** Card border style */
  variant?: 'outlined' | 'filled';
  /** Click handler for interactive cards */
  onCardClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ elevation = 'low', variant = 'filled', className, onCardClick, children, ...props }, ref) => {
    const cardClasses = [
      styles.card,
      styles[`card--elevation-${elevation}`],
      styles[`card--${variant}`],
      onCardClick && styles['card--interactive'],
      className,
    ].filter(Boolean).join(' ');

    const Component = onCardClick ? 'button' : 'div';
    const elementProps = onCardClick
      ? { ...props, onClick: onCardClick, type: 'button' as const }
      : props;

    return (
      <Component ref={ref} className={cardClasses} {...elementProps}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Sub-components
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={[styles.card__header, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, level = 3, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <Component
        ref={ref}
        className={[styles.card__title, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={[styles.card__subtitle, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </p>
  )
);

CardSubtitle.displayName = 'CardSubtitle';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={[styles.card__content, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={[styles.card__footer, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, className, align = 'end', ...props }, ref) => (
    <div
      ref={ref}
      className={[
        styles.card__actions,
        styles[`card__actions--${align}`],
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
);

CardActions.displayName = 'CardActions';

// Compound component for common use cases
interface CardCompoundProps extends CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const CardCompound: React.FC<CardCompoundProps> = ({
  title,
  subtitle,
  actions,
  children,
  ...cardProps
}) => (
  <Card {...cardProps}>
    {(title || subtitle || actions) && (
      <CardHeader>
        <div className={styles.card__headerContent}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </div>
        {actions && <CardActions>{actions}</CardActions>}
      </CardHeader>
    )}
    <CardContent>{children}</CardContent>
  </Card>
);
