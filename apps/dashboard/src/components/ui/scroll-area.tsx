import * as React from 'react';
import { cn } from '../../lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn('overflow-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' ? 'h-full w-2.5' : 'h-2.5 w-full',
        className
      )}
      {...props}
    />
  );
}

export { ScrollArea, ScrollBar };
