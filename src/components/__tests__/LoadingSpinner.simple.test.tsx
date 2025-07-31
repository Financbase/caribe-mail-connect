import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('')).toBeInTheDocument();
  });

  it('renders with text when provided', () => {
    const text = 'Loading...';
    render(<LoadingSpinner text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders without text when not provided', () => {
    render(<LoadingSpinner />);
    // Should render the component without text
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });
}); 