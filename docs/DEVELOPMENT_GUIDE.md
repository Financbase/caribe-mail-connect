# 🛠️ Development Guide

## Overview

This guide provides comprehensive information for developers working on the caribe-mail-connect application, including setup, workflows, standards, and best practices.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Required VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

### Environment Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-org/caribe-mail-connect.git
   cd caribe-mail-connect
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment variables**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
caribe-mail-connect/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── feature/        # Feature-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── auth/           # Authentication utilities
│   │   ├── api/            # API client and utilities
│   │   ├── utils/          # General utilities
│   │   └── validation/     # Validation schemas
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles and CSS
│   └── assets/             # Static assets
├── public/                 # Public static files
├── docs/                   # Documentation
├── scripts/                # Build and utility scripts
├── tests/                  # Test files
└── config/                 # Configuration files
```

## 🔧 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Feature development branches
- **hotfix/***: Critical bug fixes
- **release/***: Release preparation branches

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(auth): add OAuth login support
fix(api): resolve user data fetching issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create feature branch** from `develop`
2. **Implement changes** following coding standards
3. **Write/update tests** for new functionality
4. **Run quality checks**:

   ```bash
   npm run code-quality
   npm run test
   ```

5. **Create pull request** with descriptive title and description
6. **Request review** from team members
7. **Address feedback** and update PR
8. **Merge** after approval and passing CI/CD

## 🧪 Testing Strategy

### Testing Pyramid

1. **Unit Tests** (70%): Individual functions and components
2. **Integration Tests** (20%): Component interactions and API calls
3. **E2E Tests** (10%): Full user workflows

### Testing Tools

- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Writing Tests

#### Unit Tests

```typescript
// src/lib/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });
});
```

#### Component Tests

```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📝 Coding Standards

### TypeScript Guidelines

1. **Strict Mode**: Always use TypeScript strict mode
2. **Type Definitions**: Define interfaces for all data structures
3. **No Any**: Avoid `any` type, use `unknown` or specific types
4. **Null Safety**: Handle null/undefined cases explicitly

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const getUser = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', error);
    return null;
  }
};

// Bad
const getUser = async (id: any): Promise<any> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
```

### React Guidelines

1. **Functional Components**: Use function components with hooks
2. **Custom Hooks**: Extract reusable logic into custom hooks
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Error Boundaries**: Wrap components with error boundaries

```typescript
// Good
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  className?: string;
}

const UserCard = memo<UserCardProps>(({ user, onEdit, className }) => {
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);

  return (
    <Card className={className}>
      <CardContent>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <Button onClick={handleEdit}>Edit</Button>
      </CardContent>
    </Card>
  );
});

UserCard.displayName = 'UserCard';
```

### CSS/Styling Guidelines

1. **Tailwind CSS**: Use utility classes for styling
2. **Component Variants**: Use `cva` for component variants
3. **Responsive Design**: Mobile-first approach
4. **Dark Mode**: Support both light and dark themes

```typescript
// Component variants with cva
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);
```

## 🔍 Code Quality Tools

### ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Quality Scripts

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Run all quality checks
npm run code-quality
```

## 🚀 Performance Guidelines

### React Performance

1. **React.memo**: Memoize components that receive stable props
2. **useCallback**: Wrap event handlers and functions passed as props
3. **useMemo**: Memoize expensive calculations
4. **Code Splitting**: Use React.lazy for route-based splitting

### Bundle Optimization

1. **Tree Shaking**: Import only what you need
2. **Dynamic Imports**: Use dynamic imports for large dependencies
3. **Image Optimization**: Use optimized image formats (WebP, AVIF)
4. **Lazy Loading**: Implement lazy loading for images and components

## 🔐 Security Guidelines

### Input Validation

1. **Client-side Validation**: Use Zod for schema validation
2. **Server-side Validation**: Always validate on the server
3. **Sanitization**: Sanitize user inputs to prevent XSS

### Authentication

1. **JWT Tokens**: Use secure JWT tokens for authentication
2. **Token Storage**: Store tokens securely (httpOnly cookies)
3. **Session Management**: Implement proper session timeout

### API Security

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS properly
3. **Rate Limiting**: Implement rate limiting for API endpoints

## 📊 Monitoring and Debugging

### Development Tools

1. **React DevTools**: Browser extension for React debugging
2. **Redux DevTools**: For state management debugging
3. **Network Tab**: Monitor API calls and performance
4. **Lighthouse**: Performance and accessibility auditing

### Logging

```typescript
import { logger } from '@/lib/logging/Logger';

// Log different levels
logger.debug('Debug information', { userId: '123' });
logger.info('User logged in', { userId: '123' });
logger.warn('Deprecated API used', { endpoint: '/old-api' });
logger.error('API call failed', error, { endpoint: '/api/users' });
```

### Error Handling

```typescript
import { errorHandler } from '@/lib/error-handling/ErrorHandler';

try {
  await apiCall();
} catch (error) {
  const appError = errorHandler.createError(
    error as Error,
    ErrorSeverity.MEDIUM,
    ErrorCategory.NETWORK,
    { action: 'api_call' }
  );
  errorHandler.handleError(appError);
}
```

## 🔄 Deployment

### Build Process

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build:analyze
```

### Environment Configuration

- **Development**: `.env.local`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

### CI/CD Pipeline

1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Unit, integration, and E2E tests
3. **Security**: Dependency vulnerability scanning
4. **Build**: Production build and optimization
5. **Deploy**: Automated deployment to staging/production

---

**Last Updated**: January 2025
**Development Guide Version**: 1.0.0
**Team**: Frontend Development Team
