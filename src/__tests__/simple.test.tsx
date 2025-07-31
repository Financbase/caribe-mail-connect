import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a simple div', () => {
    render(<div data-testid="test-div">Hello World</div>);
    expect(screen.getByTestId('test-div')).toBeInTheDocument();
  });
}); 