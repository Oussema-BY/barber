'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

// Create a context for tabs
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        onValueChange: onValueChange ?? setInternalValue,
      }}
    >
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex rounded-xl bg-secondary p-1 border border-border',
        'overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0',
        'w-full sm:w-auto',
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: contextValue, onValueChange } = React.useContext(TabsContext);
    const isActive = contextValue === value;

    return (
      <button
        ref={ref}
        onClick={() => onValueChange(value)}
        className={cn(
          'px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
          'whitespace-nowrap shrink-0',
          'active:scale-[0.98]',
          isActive
            ? 'bg-card text-primary shadow-sm'
            : 'text-foreground-secondary hover:text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: contextValue } = React.useContext(TabsContext);

    if (contextValue !== value) return null;

    return (
      <div
        ref={ref}
        className={cn('mt-4 animate-fade-in', className)}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';
