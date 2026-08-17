import { cn } from '../../lib/utils';

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return <>{children}</>;
}

function SheetTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  return <>{children}</>;
}

function SheetContent({
  className,
  side = 'left',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'fixed inset-y-0 z-50 flex h-full flex-col bg-background shadow-lg',
        side === 'left' ? 'left-0' : 'right-0',
        'w-64',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-2 p-6', className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };
