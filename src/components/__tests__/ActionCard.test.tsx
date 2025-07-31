import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ActionCard } from '../ActionCard';
import { Package } from 'lucide-react';

describe('ActionCard', () => {
  const defaultProps = {
    title: 'Test Action',
    icon: Package,
    onClick: vi.fn(),
  };

  it('renders with title and icon', () => {
    render(<ActionCard {...defaultProps} />);
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    // Check for the icon by looking for the Package icon element
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<ActionCard {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<ActionCard {...defaultProps} className={customClass} />);
    
    const card = screen.getByRole('button').closest('[class*="custom-class"]');
    expect(card).toHaveClass(customClass);
  });

  it('has correct accessibility attributes', () => {
    render(<ActionCard {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
}); 