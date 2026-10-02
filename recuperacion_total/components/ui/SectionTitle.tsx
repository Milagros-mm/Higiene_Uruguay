import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 mb-8',
        centered ? 'items-center text-center' : 'items-start text-left',
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className={cn('h-1 w-20 bg-primary mt-2 rounded-full', centered ? 'mx-auto' : '')} />
    </div>
  );
}
