import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AriaSkeletonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  children?: React.ReactNode;
}

// Screen reader friendly skeleton loading component
export const AriaSkeleton = memo(({ 
  'aria-label': ariaLabel = 'Loading content',
  'aria-describedby': ariaDescribedBy,
  role = 'status',
  children,
  ...props 
}: AriaSkeletonProps & React.ComponentProps<typeof Skeleton>) => (
  <div
    role={role}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-live="polite"
  >
    <span className="sr-only">{ariaLabel}</span>
    <Skeleton {...props} />
    {children}
  </div>
));

AriaSkeleton.displayName = 'AriaSkeleton';

// ARIA-enhanced button component
interface AriaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const AriaButton = memo(({
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  loading = false,
  disabled,
  children,
  ...props
}: AriaButtonProps) => (
  <button
    {...props}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-busy={loading}
    disabled={disabled || loading}
    role="button"
    tabIndex={disabled ? -1 : 0}
  >
    {loading && <span className="sr-only">Loading...</span>}
    {children}
  </button>
));

AriaButton.displayName = 'AriaButton';

// ARIA-enhanced input with proper labeling
interface AriaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const AriaInput = memo(({
  label,
  error,
  description,
  required = false,
  id,
  className,
  ...props
}: AriaInputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <input
        {...props}
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        className={className}
      />
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

AriaInput.displayName = 'AriaInput';

// ARIA-enhanced navigation component
interface AriaNavProps {
  'aria-label': string;
  children: React.ReactNode;
  className?: string;
}

export const AriaNav = memo(({
  'aria-label': ariaLabel,
  children,
  className
}: AriaNavProps) => (
  <nav
    role="navigation"
    aria-label={ariaLabel}
    className={className}
  >
    {children}
  </nav>
));

AriaNav.displayName = 'AriaNav';

// ARIA-enhanced list component
interface AriaListProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
    'aria-label'?: string;
  }>;
  'aria-label': string;
  className?: string;
  role?: 'list' | 'listbox' | 'menu';
}

export const AriaList = memo(({
  items,
  'aria-label': ariaLabel,
  className,
  role = 'list'
}: AriaListProps) => (
  <ul
    role={role}
    aria-label={ariaLabel}
    className={className}
  >
    {items.map((item) => (
      <li
        key={item.id}
        role={role === 'list' ? 'listitem' : role === 'listbox' ? 'option' : 'menuitem'}
        aria-label={item['aria-label']}
      >
        {item.content}
      </li>
    ))}
  </ul>
));

AriaList.displayName = 'AriaList';

// ARIA-enhanced table component
interface AriaTableProps {
  caption: string;
  headers: string[];
  rows: Array<{
    id: string;
    cells: React.ReactNode[];
  }>;
  className?: string;
}

export const AriaTable = memo(({
  caption,
  headers,
  rows,
  className
}: AriaTableProps) => (
  <table role="table" className={className}>
    <caption className="sr-only">{caption}</caption>
    <thead>
      <tr role="row">
        {headers.map((header, index) => (
          <th 
            key={index}
            role="columnheader"
            scope="col"
            className="text-left font-medium"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id} role="row">
          {row.cells.map((cell, index) => (
            <td key={index} role="gridcell">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));

AriaTable.displayName = 'AriaTable';

// Keyboard navigation hook for lists
export function useKeyboardNavigation(
  itemCount: number,
  onSelect: (index: number) => void,
  enabled = true
) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!enabled) return;

    const currentIndex = parseInt(e.currentTarget.getAttribute('data-index') || '0');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, itemCount - 1);
        onSelect(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        onSelect(prevIndex);
        break;
      case 'Home':
        e.preventDefault();
        onSelect(0);
        break;
      case 'End':
        e.preventDefault();
        onSelect(itemCount - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(currentIndex);
        break;
    }
  };

  return { handleKeyDown };
}
