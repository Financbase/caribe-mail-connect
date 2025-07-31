import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('renders with custom text', () => {
    const customText = 'Loading data...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole('status')).toHaveClass('h-6', 'w-6');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('h-8', 'w-8');
  });
}); 