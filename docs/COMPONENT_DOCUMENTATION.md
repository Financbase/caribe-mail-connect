# 🧩 Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the caribe-mail-connect application, including props, usage examples, and best practices.

## 📁 Component Structure

```
src/components/
├── ui/                     # Base UI components (shadcn/ui)
├── forms/                  # Form components
├── layout/                 # Layout components
├── navigation/             # Navigation components
├── data-display/           # Data display components
├── feedback/               # Feedback components (toasts, alerts)
├── error-handling/         # Error boundary components
├── performance/            # Performance-optimized components
└── feature-specific/       # Feature-specific components
```

## 🎨 UI Components

### Button Component

**Location**: `src/components/ui/button.tsx`

**Description**: Versatile button component with multiple variants and sizes.

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Usage**:
```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="outline" size="sm">
  Small outline button
</Button>

// With icon
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>

// As child (renders as different element)
<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>
```

### Card Component

**Location**: `src/components/ui/card.tsx`

**Description**: Container component for grouping related content.

**Components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage**:
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content of the card</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input Component

**Location**: `src/components/ui/input.tsx`

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
```

**Usage**:
```tsx
import { Input } from '@/components/ui/input';

// Basic input
<Input placeholder="Enter text..." />

// With error state
<Input error placeholder="Invalid input" />

// Controlled input
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

## 📝 Form Components

### FormField Component

**Location**: `src/components/forms/FormField.tsx`

**Description**: Wrapper component for form fields with label, error handling, and validation.

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}
```

**Usage**:
```tsx
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/input';

<FormField 
  label="Email Address" 
  name="email" 
  required
  error={errors.email}
  description="We'll never share your email"
>
  <Input 
    type="email" 
    placeholder="Enter your email"
    {...register('email')}
  />
</FormField>
```

### SearchInput Component

**Location**: `src/components/forms/SearchInput.tsx`

**Description**: Debounced search input with clear functionality.

**Props**:
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}
```

**Usage**:
```tsx
import { SearchInput } from '@/components/forms/SearchInput';

<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search documents..."
  delay={300}
/>
```

## 🗂️ Layout Components

### PageLayout Component

**Location**: `src/components/layout/PageLayout.tsx`

**Description**: Standard page layout with header, sidebar, and content area.

**Props**:
```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}
```

**Usage**:
```tsx
import { PageLayout } from '@/components/layout/PageLayout';

<PageLayout
  title="Documents"
  subtitle="Manage your documents"
  actions={<Button>New Document</Button>}
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Documents', href: '/documents' }
  ]}
>
  <DocumentList />
</PageLayout>
```

### Sidebar Component

**Location**: `src/components/layout/Sidebar.tsx`

**Description**: Navigation sidebar with collapsible sections.

**Props**:
```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ComponentType;
  children?: SidebarItem[];
  badge?: string | number;
}
```

## 📊 Data Display Components

### DataTable Component

**Location**: `src/components/data-display/DataTable.tsx`

**Description**: Feature-rich data table with sorting, filtering, and pagination.

**Props**:
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  onRowClick?: (row: T) => void;
  selection?: SelectionConfig;
}
```

**Usage**:
```tsx
import { DataTable } from '@/components/data-display/DataTable';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span>{row.getValue('name')}</span>
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button size="sm" onClick={() => editUser(row.original)}>
        Edit
      </Button>
    )
  }
];

<DataTable
  data={users}
  columns={columns}
  loading={isLoading}
  pagination={{
    page: currentPage,
    pageSize: 20,
    total: totalUsers,
    onPageChange: setCurrentPage
  }}
/>
```

### StatCard Component

**Location**: `src/components/data-display/StatCard.tsx`

**Description**: Card component for displaying statistics and metrics.

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ComponentType;
  loading?: boolean;
}
```

**Usage**:
```tsx
import { StatCard } from '@/components/data-display/StatCard';
import { Users } from 'lucide-react';

<StatCard
  title="Total Users"
  value={1234}
  change={{
    value: 12,
    type: 'increase',
    period: 'vs last month'
  }}
  icon={Users}
/>
```

## 🔄 Performance Components

### LazyImage Component

**Location**: `src/components/performance/LazyImage.tsx`

**Description**: Optimized image component with lazy loading and error handling.

**Props**:
```typescript
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}
```

**Usage**:
```tsx
import { LazyImage } from '@/components/performance/LazyImage';

<LazyImage
  src="/api/images/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  placeholder="/images/placeholder.jpg"
  className="rounded-lg"
/>
```

### VirtualizedList Component

**Location**: `src/components/performance/VirtualizedList.tsx`

**Description**: Virtual scrolling list for large datasets.

**Props**:
```typescript
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
}
```

**Usage**:
```tsx
import { VirtualizedList } from '@/components/performance/VirtualizedList';

<VirtualizedList
  items={largeDataset}
  itemHeight={60}
  containerHeight={400}
  renderItem={(item, index) => (
    <div className="p-4 border-b">
      {item.name}
    </div>
  )}
  keyExtractor={(item) => item.id}
/>
```

## 🚨 Error Handling Components

### ErrorBoundary Component

**Location**: `src/components/error-handling/ErrorBoundary.tsx`

**Description**: React error boundary for catching and handling component errors.

**Usage**:
```tsx
import { ErrorBoundary, PageErrorBoundary } from '@/components/error-handling/ErrorBoundary';

// Page-level error boundary
<PageErrorBoundary name="Dashboard">
  <DashboardContent />
</PageErrorBoundary>

// Component-level error boundary
<ErrorBoundary level="component" name="UserList">
  <UserList />
</ErrorBoundary>
```

## 🎨 Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow consistent spacing patterns (4, 8, 16, 24, 32px)
- Use semantic color tokens from the design system

### Component Variants
```tsx
// Use cva (class-variance-authority) for component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3'
      }
    }
  }
);
```

## 🧪 Testing Components

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Storybook Stories
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};
```

## 📚 Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition patterns for flexibility
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Default Props**: Provide sensible defaults for optional props

### Performance
1. **React.memo**: Use for components that receive stable props
2. **useCallback**: Wrap event handlers and functions passed as props
3. **useMemo**: Memoize expensive calculations
4. **Lazy Loading**: Use React.lazy for large components

### Accessibility
1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Provide descriptive labels for screen readers
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Handle focus states properly

### Error Handling
1. **Error Boundaries**: Wrap components with appropriate error boundaries
2. **Graceful Degradation**: Provide fallbacks for failed states
3. **User Feedback**: Show meaningful error messages to users

---

**Last Updated**: January 2025
**Component Library Version**: 1.0.0
**Documentation Version**: 1.0.0
