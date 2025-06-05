import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
