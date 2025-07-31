import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualMailReporting } from '../virtual-mail/VirtualMailReporting';
import { useVirtualMailbox } from '../../hooks/useVirtualMailbox';

// Mock the useVirtualMailbox hook
jest.mock('../../hooks/useVirtualMailbox');

const mockUseVirtualMailbox = useVirtualMailbox as jest.MockedFunction<typeof useVirtualMailbox>;

describe('VirtualMailReporting', () => {
  const mockReportData = {
    virtualMailboxes: [
      {
        id: '1',
        customer_id: 'customer1',
        mailbox_number: 'MB001',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        last_activity: '2024-01-15T00:00:00Z'
      }
    ],
    revenue: [
      {
        id: '1',
        mailbox_id: '1',
        amount: 25.00,
        service_type: 'monthly_fee',
        created_at: '2024-01-01T00:00:00Z'
      }
    ],
    actionBreakdown: [
      { name: 'Scanned', value: 50, count: 25 },
      { name: 'Forwarded', value: 30, count: 15 },
      { name: 'Shredded', value: 20, count: 10 }
    ],
    customerTiers: [
      { tier: 'Premium', count: 10, revenue: 500 },
      { tier: 'Standard', count: 25, revenue: 750 },
      { tier: 'Basic', count: 15, revenue: 300 }
    ],
    monthlyTrends: [
      { month: 'Jan', revenue: 500, actions: 100 },
      { month: 'Feb', revenue: 550, actions: 110 },
      { month: 'Mar', revenue: 600, actions: 120 }
    ]
  };

  beforeEach(() => {
    mockUseVirtualMailbox.mockReturnValue({
      reportData: mockReportData,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    render(<VirtualMailReporting />);
    expect(screen.getByText('Virtual Mail Reporting')).toBeInTheDocument();
  });

  it('displays loading state when data is loading', () => {
    mockUseVirtualMailbox.mockReturnValue({
      reportData: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<VirtualMailReporting />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    mockUseVirtualMailbox.mockReturnValue({
      reportData: null,
      loading: false,
      error: new Error('Failed to load data'),
      refetch: jest.fn(),
    });

    render(<VirtualMailReporting />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('renders all report sections when data is available', () => {
    render(<VirtualMailReporting />);
    
    expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    expect(screen.getByText('Action Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Customer Tiers')).toBeInTheDocument();
    expect(screen.getByText('Monthly Trends')).toBeInTheDocument();
  });

  it('displays correct revenue data', () => {
    render(<VirtualMailReporting />);
    
    // Check for revenue metrics
    expect(screen.getByText('$1,550.00')).toBeInTheDocument(); // Total revenue
    expect(screen.getByText('50')).toBeInTheDocument(); // Total mailboxes
  });

  it('displays action breakdown chart', () => {
    render(<VirtualMailReporting />);
    
    expect(screen.getByText('Scanned')).toBeInTheDocument();
    expect(screen.getByText('Forwarded')).toBeInTheDocument();
    expect(screen.getByText('Shredded')).toBeInTheDocument();
  });

  it('displays customer tier information', () => {
    render(<VirtualMailReporting />);
    
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('displays monthly trends', () => {
    render(<VirtualMailReporting />);
    
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('handles date range changes', async () => {
    const mockRefetch = jest.fn();
    mockUseVirtualMailbox.mockReturnValue({
      reportData: mockReportData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<VirtualMailReporting />);
    
    // Simulate date range change
    const dateRangeSelector = screen.getByText(/date range/i);
    fireEvent.click(dateRangeSelector);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
}); 