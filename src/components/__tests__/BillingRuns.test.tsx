import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingRuns } from '../billing/BillingRuns';
import { useBilling } from '../../hooks/useBilling';

// Mock the useBilling hook
jest.mock('../../hooks/useBilling');

const mockUseBilling = useBilling as jest.MockedFunction<typeof useBilling>;

describe('BillingRuns', () => {
  const mockBillingRuns = [
    {
      id: '1',
      run_date: '2024-01-15T00:00:00Z',
      status: 'completed',
      total_invoices: 150,
      total_amount: 15000.00,
      created_by: 'admin@prmcms.com',
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      run_date: '2024-01-14T00:00:00Z',
      status: 'pending',
      total_invoices: 100,
      total_amount: 10000.00,
      created_by: 'admin@prmcms.com',
      created_at: '2024-01-14T00:00:00Z'
    }
  ];

  beforeEach(() => {
    mockUseBilling.mockReturnValue({
      billingRuns: mockBillingRuns,
      loading: false,
      error: null,
      createBillingRun: jest.fn(),
      updateBillingRun: jest.fn(),
      deleteBillingRun: jest.fn(),
      executeBillingRun: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    render(<BillingRuns />);
    expect(screen.getByText('Billing Runs')).toBeInTheDocument();
  });

  it('displays loading state when data is loading', () => {
    mockUseBilling.mockReturnValue({
      billingRuns: [],
      loading: true,
      error: null,
      createBillingRun: jest.fn(),
      updateBillingRun: jest.fn(),
      deleteBillingRun: jest.fn(),
      executeBillingRun: jest.fn(),
    });

    render(<BillingRuns />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    mockUseBilling.mockReturnValue({
      billingRuns: [],
      loading: false,
      error: new Error('Failed to load billing runs'),
      createBillingRun: jest.fn(),
      updateBillingRun: jest.fn(),
      deleteBillingRun: jest.fn(),
      executeBillingRun: jest.fn(),
    });

    render(<BillingRuns />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('displays billing runs table when data is available', () => {
    render(<BillingRuns />);
    
    expect(screen.getByText('Run Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Total Invoices')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
  });

  it('displays billing run data correctly', () => {
    render(<BillingRuns />);
    
    expect(screen.getByText('150')).toBeInTheDocument(); // Total invoices
    expect(screen.getByText('$15,000.00')).toBeInTheDocument(); // Total amount
    expect(screen.getByText('completed')).toBeInTheDocument(); // Status
  });

  it('shows create new billing run button', () => {
    render(<BillingRuns />);
    
    const createButton = screen.getByText('Create New Billing Run');
    expect(createButton).toBeInTheDocument();
  });

  it('opens create dialog when create button is clicked', () => {
    render(<BillingRuns />);
    
    const createButton = screen.getByText('Create New Billing Run');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Create Billing Run')).toBeInTheDocument();
  });

  it('handles billing run execution', async () => {
    const mockExecuteBillingRun = jest.fn();
    mockUseBilling.mockReturnValue({
      billingRuns: mockBillingRuns,
      loading: false,
      error: null,
      createBillingRun: jest.fn(),
      updateBillingRun: jest.fn(),
      deleteBillingRun: jest.fn(),
      executeBillingRun: mockExecuteBillingRun,
    });

    render(<BillingRuns />);
    
    // Find and click execute button for pending run
    const executeButtons = screen.getAllByText('Execute');
    fireEvent.click(executeButtons[0]);

    await waitFor(() => {
      expect(mockExecuteBillingRun).toHaveBeenCalledWith('2'); // ID of pending run
    });
  });

  it('handles billing run deletion', async () => {
    const mockDeleteBillingRun = jest.fn();
    mockUseBilling.mockReturnValue({
      billingRuns: mockBillingRuns,
      loading: false,
      error: null,
      createBillingRun: jest.fn(),
      updateBillingRun: jest.fn(),
      deleteBillingRun: mockDeleteBillingRun,
      executeBillingRun: jest.fn(),
    });

    render(<BillingRuns />);
    
    // Find and click delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteBillingRun).toHaveBeenCalledWith('1');
    });
  });

  it('filters billing runs by status', () => {
    render(<BillingRuns />);
    
    const statusFilter = screen.getByText('All Statuses');
    fireEvent.click(statusFilter);
    
    // Check for filter options
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('displays correct status badges', () => {
    render(<BillingRuns />);
    
    const completedBadge = screen.getByText('completed');
    const pendingBadge = screen.getByText('pending');
    
    expect(completedBadge).toHaveClass('bg-green-100', 'text-green-800');
    expect(pendingBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });
}); 