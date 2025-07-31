import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditLogs } from '../admin/AuditLogs';
import { useSecurity } from '../../hooks/useSecurity';

// Mock the useSecurity hook
jest.mock('../../hooks/useSecurity');

const mockUseSecurity = useSecurity as jest.MockedFunction<typeof useSecurity>;

describe('AuditLogs', () => {
  const mockAuditLogs = [
    {
      id: '1',
      user_id: 'user1',
      action: 'login',
      resource_type: 'auth',
      resource_id: 'auth1',
      details: { ip_address: '192.168.1.1', user_agent: 'Mozilla/5.0' },
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
      location_data: { country: 'US', city: 'New York' },
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'user2',
      action: 'package_created',
      resource_type: 'package',
      resource_id: 'pkg1',
      details: { package_id: 'pkg1', customer_id: 'cust1' },
      ip_address: '192.168.1.2',
      user_agent: 'Mozilla/5.0',
      location_data: { country: 'US', city: 'Los Angeles' },
      created_at: '2024-01-14T00:00:00Z'
    }
  ];

  const mockAnomalyAlerts = [
    {
      id: '1',
      type: 'unusual_login',
      severity: 'high',
      description: 'Multiple failed login attempts',
      metrics: { failed_attempts: 5, time_window: '5 minutes' },
      created_at: '2024-01-15T00:00:00Z',
      resolved: false
    }
  ];

  beforeEach(() => {
    mockUseSecurity.mockReturnValue({
      auditLogs: mockAuditLogs,
      anomalyAlerts: mockAnomalyAlerts,
      loading: false,
      error: null,
      fetchAuditLogs: jest.fn(),
      fetchAnomalyAlerts: jest.fn(),
      resolveAnomaly: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    render(<AuditLogs />);
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
  });

  it('displays loading state when data is loading', () => {
    mockUseSecurity.mockReturnValue({
      auditLogs: [],
      anomalyAlerts: [],
      loading: true,
      error: null,
      fetchAuditLogs: jest.fn(),
      fetchAnomalyAlerts: jest.fn(),
      resolveAnomaly: jest.fn(),
    });

    render(<AuditLogs />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays audit logs table when data is available', () => {
    render(<AuditLogs />);
    
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('IP Address')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('displays audit log data correctly', () => {
    render(<AuditLogs />);
    
    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.getByText('package_created')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
  });

  it('displays anomaly alerts section', () => {
    render(<AuditLogs />);
    
    expect(screen.getByText('Anomaly Alerts')).toBeInTheDocument();
    expect(screen.getByText('Multiple failed login attempts')).toBeInTheDocument();
  });

  it('filters audit logs by action type', () => {
    render(<AuditLogs />);
    
    const actionFilter = screen.getByText('All Actions');
    fireEvent.click(actionFilter);
    
    // Check for filter options
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Package Created')).toBeInTheDocument();
    expect(screen.getByText('User Created')).toBeInTheDocument();
  });

  it('filters audit logs by date range', () => {
    render(<AuditLogs />);
    
    const dateRangeSelector = screen.getByText(/date range/i);
    fireEvent.click(dateRangeSelector);
    
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    expect(screen.getByText('Custom range')).toBeInTheDocument();
  });

  it('handles anomaly resolution', async () => {
    const mockResolveAnomaly = jest.fn();
    mockUseSecurity.mockReturnValue({
      auditLogs: mockAuditLogs,
      anomalyAlerts: mockAnomalyAlerts,
      loading: false,
      error: null,
      fetchAuditLogs: jest.fn(),
      fetchAnomalyAlerts: jest.fn(),
      resolveAnomaly: mockResolveAnomaly,
    });

    render(<AuditLogs />);
    
    const resolveButton = screen.getByText('Resolve');
    fireEvent.click(resolveButton);

    await waitFor(() => {
      expect(mockResolveAnomaly).toHaveBeenCalledWith('1');
    });
  });

  it('displays correct severity badges', () => {
    render(<AuditLogs />);
    
    const highSeverityBadge = screen.getByText('high');
    expect(highSeverityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('exports audit logs', () => {
    render(<AuditLogs />);
    
    const exportButton = screen.getByText('Export Logs');
    fireEvent.click(exportButton);
    
    // Should trigger download or show export dialog
    expect(screen.getByText('Export Audit Logs')).toBeInTheDocument();
  });

  it('searches audit logs', () => {
    render(<AuditLogs />);
    
    const searchInput = screen.getByPlaceholderText('Search logs...');
    fireEvent.change(searchInput, { target: { value: 'login' } });
    
    // Should filter results to show only login actions
    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.queryByText('package_created')).not.toBeInTheDocument();
  });
}); 