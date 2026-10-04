import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-xl border-2 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#46a302] bg-[#58cc02] text-white',
        secondary: 'border-slate-200 bg-slate-100 text-slate-700',
        destructive: 'border-[#d11f1f] bg-[#ea2b2b] text-white',
        outline: 'border-slate-300 text-slate-700 bg-white',
        success: 'border-[#a5ed6e] bg-[#d7ffb8] text-[#2b7a00]',
        warning: 'border-[#ffd900] bg-[#fff2d6] text-[#b86900]',
        der: 'border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]',
        die: 'border-[#ffc1c1] bg-[#ffdfe0] text-[#ff4b4b]',
        das: 'border-[#a5ed6e] bg-[#d7ffb8] text-[#2b7a00]',
        pl: 'border-[#ddb1ff] bg-[#f4e6ff] text-[#a435f0]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
