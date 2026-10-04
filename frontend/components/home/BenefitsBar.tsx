import React from 'react';
import { benefits } from '@/lib/mock-data';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function BenefitsBar() {
  return (
    <section className="relative z-30 -mt-8 sm:-mt-10 mb-4 md:mb-6 container mx-auto px-4">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200/80 rounded-2xl">
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {benefits.map((benefit) => {
              // Map icon string to actual Lucide component
              const Icon = Icons[benefit.icon as keyof typeof Icons] as React.ElementType;
              return (
                <div key={benefit.id} className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6 first:pl-0 first:pt-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-brand-cyan border border-cyan-100/50">
                    {Icon ? <Icon className="h-6 w-6" /> : <Icons.Check className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-800 leading-tight">{benefit.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-snug">{benefit.description}</p>
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
