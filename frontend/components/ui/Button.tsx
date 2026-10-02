'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
      outline: 'border border-primary text-primary hover:bg-primary/10',
      ghost: 'hover:bg-muted text-foreground',
    };
    
    const sizes = {
      default: 'h-11 px-6 py-2',
      sm: 'h-9 px-4 text-sm',
      lg: 'h-14 px-8 text-lg',
      icon: 'h-11 w-11 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
