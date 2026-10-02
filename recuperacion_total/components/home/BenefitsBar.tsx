import React from 'react';
import { benefits } from '@/lib/mock-data';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function BenefitsBar() {
  return (
    <section className="relative z-10 -mt-10 mb-16 container mx-auto px-4">
      <Card className="bg-white/95 backdrop-blur shadow-xl border-white/20">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {benefits.map((benefit) => {
              // Map icon string to actual Lucide component
              const Icon = Icons[benefit.icon as keyof typeof Icons] as React.ElementType;
              return (
                <div key={benefit.id} className="flex items-start gap-4 pt-4 sm:pt-0 sm:pl-6 first:pl-0 first:pt-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cyan-light/10 text-brand-cyan">
                    {Icon ? <Icon className="h-6 w-6" /> : <Icons.Check className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
