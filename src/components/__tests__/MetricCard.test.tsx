import { render, screen } from '@testing-library/react';
import { MetricCard } from '../analytics/MetricCard';
import { DollarSign } from 'lucide-react';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: '$1,234.56',
    icon: DollarSign,
  };

  it('renders title, value, and icon', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
  });

  it('renders with trend data', () => {
    const propsWithTrend = {
      ...defaultProps,
      trend: '+12.5%',
      trendDirection: 'up' as const,
    };
    
    render(<MetricCard {...propsWithTrend} />);
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders with description', () => {
    const propsWithDescription = {
      ...defaultProps,
      description: 'Compared to last month',
    };
    
    render(<MetricCard {...propsWithDescription} />);
    expect(screen.getByText('Compared to last month')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-metric-card';
    render(<MetricCard {...defaultProps} className={customClass} />);
    
    const card = screen.getByTestId('metric-card');
    expect(card).toHaveClass(customClass);
  });
}); 