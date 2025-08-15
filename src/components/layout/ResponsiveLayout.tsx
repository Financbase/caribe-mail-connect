/**
 * Responsive Layout System
 * Professional UI System - Responsive Layout System
 * 
 * Mobile-first responsive design patterns for enterprise SaaS applications
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// =====================================================
// GRID SYSTEM COMPONENT
// =====================================================

const gridVariants = cva(
  'grid gap-4',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        auto: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
      },
      gap: {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      }
    },
    defaultVariants: {
      cols: 'auto',
      gap: 'md'
    }
  }
);

export interface ResponsiveGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        className={cn(gridVariants({ cols, gap, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ResponsiveGrid.displayName = 'ResponsiveGrid';

// =====================================================
// CONTAINER COMPONENT
// =====================================================

const containerVariants = cva(
  'mx-auto px-4 sm:px-6 lg:px-8',
  {
    variants: {
      size: {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-7xl',
        xl: 'max-w-screen-2xl',
        full: 'max-w-full'
      },
      padding: {
        none: 'px-0',
        sm: 'px-2 sm:px-4',
        md: 'px-4 sm:px-6 lg:px-8',
        lg: 'px-6 sm:px-8 lg:px-12'
      }
    },
    defaultVariants: {
      size: 'lg',
      padding: 'md'
    }
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariants({ size, padding, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

// =====================================================
// FLEX LAYOUT COMPONENT
// =====================================================

const flexVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        col: 'flex-col',
        'col-reverse': 'flex-col-reverse'
      },
      wrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse'
      },
      justify: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly'
      },
      align: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch'
      },
      gap: {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      }
    },
    defaultVariants: {
      direction: 'row',
      wrap: 'nowrap',
      justify: 'start',
      align: 'start',
      gap: 'md'
    }
  }
);

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, justify, align, gap, ...props }, ref) => {
    return (
      <div
        className={cn(flexVariants({ direction, wrap, justify, align, gap, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Flex.displayName = 'Flex';

// =====================================================
// STACK COMPONENT
// =====================================================

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing = 'md', align = 'stretch', children, ...props }, ref) => {
    const spacingClasses = {
      none: 'space-y-0',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8'
    };

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    };

    return (
      <div
        className={cn(
          'flex flex-col',
          spacingClasses[spacing],
          alignClasses[align],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Stack.displayName = 'Stack';

// =====================================================
// SIDEBAR LAYOUT COMPONENT
// =====================================================

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ 
    sidebar, 
    children, 
    sidebarWidth = 'md', 
    collapsible = false, 
    defaultCollapsed = false,
    className 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const sidebarWidths = {
      sm: isCollapsed ? 'w-16' : 'w-48',
      md: isCollapsed ? 'w-16' : 'w-64',
      lg: isCollapsed ? 'w-16' : 'w-80'
    };

    return (
      <div ref={ref} className={cn('flex h-screen', className)}>
        {/* Sidebar */}
        <div className={cn(
          'bg-muted/50 border-r transition-all duration-300 ease-in-out',
          sidebarWidths[sidebarWidth],
          'hidden lg:block'
        )}>
          {sidebar}
        </div>

        {/* Mobile Sidebar Overlay */}
        {!isCollapsed && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsCollapsed(true)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-background border-r">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  }
);
SidebarLayout.displayName = 'SidebarLayout';

// =====================================================
// RESPONSIVE BREAKPOINT HOOK
// =====================================================

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string>('');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2Xl: breakpoint === '2xl',
    isMobile: ['xs', 'sm'].includes(breakpoint),
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint)
  };
}

// =====================================================
// RESPONSIVE VISIBILITY COMPONENT
// =====================================================

export interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  hideOn?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  showOn?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  className?: string;
}

export const ResponsiveVisibility = React.forwardRef<HTMLDivElement, ResponsiveVisibilityProps>(
  ({ children, hideOn = [], showOn = [], className }, ref) => {
    const { breakpoint } = useBreakpoint();

    const shouldHide = hideOn.includes(breakpoint as any);
    const shouldShow = showOn.length === 0 || showOn.includes(breakpoint as any);

    if (shouldHide || !shouldShow) {
      return null;
    }

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
);
ResponsiveVisibility.displayName = 'ResponsiveVisibility';

// =====================================================
// ASPECT RATIO COMPONENT
// =====================================================

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio: number; // width / height
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
        {...props}
      >
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    );
  }
);
AspectRatio.displayName = 'AspectRatio';

// =====================================================
// MASONRY LAYOUT COMPONENT
// =====================================================

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ 
    columns = { default: 1, sm: 2, md: 3, lg: 4 }, 
    gap = 16, 
    children, 
    className, 
    ...props 
  }, ref) => {
    const { breakpoint } = useBreakpoint();
    
    const getColumnCount = () => {
      switch (breakpoint) {
        case 'xs': return columns.default;
        case 'sm': return columns.sm || columns.default;
        case 'md': return columns.md || columns.sm || columns.default;
        case 'lg': return columns.lg || columns.md || columns.sm || columns.default;
        case 'xl':
        case '2xl': return columns.xl || columns.lg || columns.md || columns.sm || columns.default;
        default: return columns.default;
      }
    };

    const columnCount = getColumnCount();
    const childrenArray = React.Children.toArray(children);
    const columnWrappers = Array.from({ length: columnCount }, () => [] as React.ReactNode[]);

    childrenArray.forEach((child, index) => {
      const columnIndex = index % columnCount;
      columnWrappers[columnIndex].push(child);
    });

    return (
      <div
        ref={ref}
        className={cn('flex', className)}
        style={{ gap }}
        {...props}
      >
        {columnWrappers.map((column, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col"
            style={{ gap }}
          >
            {column}
          </div>
        ))}
      </div>
    );
  }
);
Masonry.displayName = 'Masonry';
