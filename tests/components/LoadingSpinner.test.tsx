import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('uses medium size by default', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-6 w-6');
  });

  it('renders provided text', () => {
    render(<LoadingSpinner size="lg" text="Loading data" />);
    expect(screen.getByText('Loading data')).toBeInTheDocument();
  });
});
