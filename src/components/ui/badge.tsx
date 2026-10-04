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

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: '#2563eb', borderColor: '#1d4ed8', color: '#ffffff' },
  secondary: { background: '#f1f5f9', borderColor: '#cbd5e1', color: '#334155' },
  destructive: { background: '#ea2b2b', borderColor: '#d11f1f', color: '#ffffff' },
  outline: { background: '#ffffff', borderColor: '#cbd5e1', color: '#334155' },
  success: { background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' },
  warning: { background: '#fffbeb', borderColor: '#fde68a', color: '#b45309' },
  der: { background: '#dbeafe', borderColor: '#93c5fd', color: '#1d4ed8' },
  die: { background: '#ffe4e6', borderColor: '#fecdd3', color: '#e11d48' },
  das: { background: '#dcfce7', borderColor: '#86efac', color: '#15803d' },
  pl: { background: '#f3e8ff', borderColor: '#d8b4fe', color: '#7e22ce' },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = 'default', style, ...props }: BadgeProps) {
  const v = (variant as string) || 'default';
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'solid',
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1.2,
        ...variantStyles[v],
        ...style,
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
