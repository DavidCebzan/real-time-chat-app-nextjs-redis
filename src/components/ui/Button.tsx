import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import React, { HTMLAttributes } from 'react'


export const buttonVariant = cva(
  'active:scale-95 inline-flex items-enter justify-center rounded-md text-sm font-medium transition-color focus:uotline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled-pouinter-events-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }

  }
)

type ButtonProps = {
  isLoading?: boolean;
} & HTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariant>;

function Button({className, children, variant,isLoading, size,...props}: ButtonProps) {
  return (
    <button className={cn(buttonVariant({variant, size, className}))} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className='mr-2 h-4 w-2 animate-spin'/> : null}
      {children}
    </button>
  )
}


export default Button
