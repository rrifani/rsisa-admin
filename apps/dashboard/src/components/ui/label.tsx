import { cn } from '../../lib/utils';
import type { LabelHTMLAttributes, FC } from 'react';

export const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
);
