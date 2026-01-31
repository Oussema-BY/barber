import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground-secondary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border-2 bg-input text-foreground placeholder-input-placeholder',
          'border-input-border',
          'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-light',
          'transition-all duration-200',
          error && 'border-destructive focus:border-destructive focus:ring-destructive-light',
          'disabled:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-destructive font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-foreground-muted">{helperText}</p>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border-2 bg-input text-foreground',
            'border-input-border',
            'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-light',
            'transition-all duration-200 appearance-none cursor-pointer pr-10',
            error && 'border-destructive focus:border-destructive focus:ring-destructive-light',
            'disabled:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          <option value="" className="text-foreground-muted">Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-tertiary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  )
);

Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground-secondary mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border-2 bg-input text-foreground placeholder-input-placeholder font-sans',
          'border-input-border',
          'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-light',
          'transition-all duration-200 resize-y min-h-25',
          error && 'border-destructive focus:border-destructive focus:ring-destructive-light',
          'disabled:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
