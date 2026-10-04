import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-extrabold uppercase tracking-[0.053em] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5 active:border-b-2',
  {
    variants: {
      variant: {
        default:
          'bg-[#58cc02] text-white border-2 border-[#58cc02] border-b-4 border-b-[#46a302] hover:bg-[#52bf02] hover:border-[#52bf02]',
        destructive:
          'bg-[#ea2b2b] text-white border-2 border-[#ea2b2b] border-b-4 border-b-[#d11f1f] hover:bg-[#dc2626]',
        outline:
          'border-2 border-slate-200 border-b-4 border-b-slate-300 bg-white text-[#1cb0f6] hover:bg-slate-50 hover:border-slate-300',
        secondary:
          'bg-[#1cb0f6] text-white border-2 border-[#1cb0f6] border-b-4 border-b-[#1899d6] hover:bg-[#19a0e0]',
        ghost:
          'border-2 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        link: 'text-[#1cb0f6] underline-offset-4 hover:underline normal-case tracking-normal',
      },
      size: {
        default: 'h-12 px-6 py-2.5',
        sm: 'h-10 rounded-xl px-4 text-xs',
        lg: 'h-14 rounded-2xl px-8 text-base',
        icon: 'h-11 w-11 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
