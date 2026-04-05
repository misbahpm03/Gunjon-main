import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md': variant === 'default',
            'border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300': variant === 'outline',
            'hover:bg-gray-100 hover:text-gray-900': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md': variant === 'destructive',
            'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
            'h-12 sm:h-11 px-6': size === 'default',
            'h-10 rounded-lg px-4 text-xs': size === 'sm',
            'h-14 sm:h-12 px-8 text-base font-semibold': size === 'lg',
            'h-12 w-12 sm:h-11 sm:w-11 rounded-full': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
