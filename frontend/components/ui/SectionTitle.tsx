import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('space-y-2', centered && 'text-center mx-auto max-w-2xl', className)}>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold tracking-tight text-brand-blue">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
