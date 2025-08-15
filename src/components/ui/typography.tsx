/**
 * Typography System
 * Story 2: Professional UI System - Design System Foundation
 * 
 * Comprehensive typography components with consistent styling,
 * semantic HTML, and accessibility features
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// =====================================================
// TYPOGRAPHY VARIANTS
// =====================================================

const headingVariants = cva(
  'font-display font-bold tracking-tight text-foreground',
  {
    variants: {
      size: {
        h1: 'text-4xl md:text-5xl lg:text-6xl',
        h2: 'text-3xl md:text-4xl lg:text-5xl',
        h3: 'text-2xl md:text-3xl lg:text-4xl',
        h4: 'text-xl md:text-2xl lg:text-3xl',
        h5: 'text-lg md:text-xl lg:text-2xl',
        h6: 'text-base md:text-lg lg:text-xl'
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold'
      },
      color: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        error: 'text-red-600',
        info: 'text-blue-600'
      }
    },
    defaultVariants: {
      size: 'h1',
      weight: 'bold',
      color: 'default'
    }
  }
);

const textVariants = cva(
  'text-body',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      },
      weight: {
        thin: 'font-thin',
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
      },
      color: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        error: 'text-red-600',
        info: 'text-blue-600'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
      }
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'default',
      align: 'left'
    }
  }
);

const codeVariants = cva(
  'font-mono rounded px-1.5 py-0.5 text-sm',
  {
    variants: {
      variant: {
        inline: 'bg-muted text-muted-foreground',
        block: 'bg-muted p-4 rounded-lg overflow-x-auto',
        subtle: 'bg-transparent text-muted-foreground'
      }
    },
    defaultVariants: {
      variant: 'inline'
    }
  }
);

// =====================================================
// HEADING COMPONENTS
// =====================================================

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, weight, color, as, ...props }, ref) => {
    const Comp = as || (size === 'h1' ? 'h1' : size === 'h2' ? 'h2' : size === 'h3' ? 'h3' : size === 'h4' ? 'h4' : size === 'h5' ? 'h5' : 'h6');
    
    return (
      <Comp
        className={cn(headingVariants({ size, weight, color, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// Specific heading components
export const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h1" as="h1" {...props} />
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h2" as="h2" {...props} />
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h3" as="h3" {...props} />
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h4" as="h4" {...props} />
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h5" as="h5" {...props} />
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'size'>>(
  (props, ref) => <Heading ref={ref} size="h6" as="h6" {...props} />
);
H6.displayName = 'H6';

// =====================================================
// TEXT COMPONENTS
// =====================================================

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, weight, color, align, as = 'p', ...props }, ref) => {
    const Comp = as;
    
    return (
      <Comp
        className={cn(textVariants({ size, weight, color, align, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

// Specific text components
export const Paragraph = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref as any} as="p" {...props} />
);
Paragraph.displayName = 'Paragraph';

export const Span = React.forwardRef<HTMLSpanElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref as any} as="span" {...props} />
);
Span.displayName = 'Span';

export const Label = React.forwardRef<HTMLLabelElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref as any} as="label" {...props} />
);
Label.displayName = 'Label';

export const Strong = React.forwardRef<HTMLElement, Omit<TextProps, 'as' | 'weight'>>(
  (props, ref) => <Text ref={ref} as="strong" weight="semibold" {...props} />
);
Strong.displayName = 'Strong';

export const Emphasis = React.forwardRef<HTMLElement, Omit<TextProps, 'as'>>(
  (props, ref) => <Text ref={ref} as="em" {...props} />
);
Emphasis.displayName = 'Emphasis';

export const Small = React.forwardRef<HTMLElement, Omit<TextProps, 'as' | 'size'>>(
  (props, ref) => <Text ref={ref} as="small" size="sm" {...props} />
);
Small.displayName = 'Small';

// =====================================================
// CODE COMPONENTS
// =====================================================

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  as?: 'code' | 'pre';
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, as = 'code', ...props }, ref) => {
    const Comp = as;
    
    return (
      <Comp
        className={cn(codeVariants({ variant, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Code.displayName = 'Code';

export const CodeBlock = React.forwardRef<HTMLPreElement, Omit<CodeProps, 'as' | 'variant'>>(
  (props, ref) => <Code ref={ref as any} as="pre" variant="block" {...props} />
);
CodeBlock.displayName = 'CodeBlock';

// =====================================================
// LINK COMPONENT
// =====================================================

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'muted' | 'primary' | 'destructive';
  underline?: 'always' | 'hover' | 'never';
}

const linkVariants = cva(
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-foreground hover:text-primary',
        muted: 'text-muted-foreground hover:text-foreground',
        primary: 'text-primary hover:text-primary/80',
        destructive: 'text-destructive hover:text-destructive/80'
      },
      underline: {
        always: 'underline',
        hover: 'hover:underline',
        never: 'no-underline'
      }
    },
    defaultVariants: {
      variant: 'primary',
      underline: 'hover'
    }
  }
);

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, underline, ...props }, ref) => {
    return (
      <a
        className={cn(linkVariants({ variant, underline, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = 'Link';

// =====================================================
// LIST COMPONENTS
// =====================================================

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  as?: 'ul' | 'ol';
  variant?: 'default' | 'none' | 'disc' | 'decimal';
}

const listVariants = cva(
  'space-y-2',
  {
    variants: {
      variant: {
        default: '',
        none: 'list-none',
        disc: 'list-disc list-inside',
        decimal: 'list-decimal list-inside'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, variant, as = 'ul', ...props }, ref) => {
    const Comp = as;
    
    return (
      <Comp
        className={cn(listVariants({ variant, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
List.displayName = 'List';

export const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        className={cn('text-foreground', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
ListItem.displayName = 'ListItem';

// =====================================================
// BLOCKQUOTE COMPONENT
// =====================================================

export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  cite?: string;
}

export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, cite, ...props }, ref) => {
    return (
      <blockquote
        className={cn(
          'border-l-4 border-primary pl-6 italic text-muted-foreground',
          className
        )}
        cite={cite}
        ref={ref}
        {...props}
      />
    );
  }
);
Blockquote.displayName = 'Blockquote';
