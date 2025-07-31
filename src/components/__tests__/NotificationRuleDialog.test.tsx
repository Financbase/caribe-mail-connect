import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { NotificationRuleDialog } from '../notifications/NotificationRuleDialog';
import { useNotificationSystem } from '../../hooks/useNotificationSystem';

// Mock the useNotificationSystem hook
vi.mock('../../hooks/useNotificationSystem');

const mockUseNotificationSystem = useNotificationSystem as vi.MockedFunction<typeof useNotificationSystem>;

describe('NotificationRuleDialog', () => {
  const mockProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSuccess: vi.fn(),
  };

  const mockRule = {
    id: '1',
    name: 'Test Rule',
    description: 'Test Description',
    trigger_type: 'package_arrival',
    conditions: {
      customer_type: 'premium',
      location: 'main'
    },
    channels: {
      email: true,
      sms: false,
      whatsapp: false,
      push: true
    },
    delay_minutes: 0,
    is_active: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  };

  beforeEach(() => {
    mockUseNotificationSystem.mockReturnValue({
      rules: [mockRule],
      loading: false,
      createRule: vi.fn(),
      updateRule: vi.fn(),
      deleteRule: vi.fn(),
      toggleRule: vi.fn(),
      isCreatingRule: false,
      isUpdatingRule: false,
    });
  });

  it('renders dialog when open', () => {
    render(<NotificationRuleDialog {...mockProps} />);
    expect(screen.getByText('Nueva Regla de Notificación')).toBeInTheDocument();
  });

  it('renders edit mode when rule is provided', () => {
    render(<NotificationRuleDialog {...mockProps} rule={mockRule} />);
    expect(screen.getByText('Editar Regla de Notificación')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Rule')).toBeInTheDocument();
  });

  it('renders create mode when no rule is provided', () => {
    render(<NotificationRuleDialog {...mockProps} />);
    expect(screen.getByText('Nueva Regla de Notificación')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Recordatorio después de 3 días')).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel is clicked', () => {
    render(<NotificationRuleDialog {...mockProps} />);
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('submits form with correct data', async () => {
    const mockCreateRule = vi.fn();
    mockUseNotificationSystem.mockReturnValue({
      rules: [],
      loading: false,
      createRule: mockCreateRule,
      updateRule: vi.fn(),
      deleteRule: vi.fn(),
      toggleRule: vi.fn(),
      isCreatingRule: false,
      isUpdatingRule: false,
    });

    render(<NotificationRuleDialog {...mockProps} />);
    
    // Fill in form fields
    fireEvent.change(screen.getByPlaceholderText('Ej: Recordatorio después de 3 días'), {
      target: { value: 'New Rule' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe cuándo y cómo se activará esta regla'), {
      target: { value: 'New Description' }
    });

    // Submit form
    const submitButton = screen.getByText('Crear Regla');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateRule).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Rule',
          description: 'New Description'
        })
      );
    });
  });

  it('validates required fields', async () => {
    render(<NotificationRuleDialog {...mockProps} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Crear Regla');
    fireEvent.click(submitButton);

    // Check that the name input field is still empty (required field)
    const nameInput = screen.getByPlaceholderText('Ej: Recordatorio después de 3 días');
    expect(nameInput).toHaveValue('');
  });
}); 