import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerForm } from '../CustomerForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('../../hooks/useCustomers', () => ({
  useCustomers: () => ({
    createCustomer: vi.fn().mockResolvedValue({ id: '123' }),
    updateCustomer: vi.fn().mockResolvedValue({ id: '123' }),
    loading: false,
    error: null
  })
}));

vi.mock('../../hooks/useMailboxes', () => ({
  useMailboxes: () => ({
    availableMailboxes: [
      { id: '1', number: 'MB001', status: 'available' },
      { id: '2', number: 'MB002', status: 'available' }
    ],
    loading: false
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CustomerForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all required fields', () => {
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    });

    it('should render mailbox selection field', () => {
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/mailbox/i)).toBeInTheDocument();
    });

    it('should render CMRA form fields when applicable', () => {
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} showCMRA />);
      
      expect(screen.getByLabelText(/form 1583/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/id verification/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '123'); // Invalid phone
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid phone format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Fill in the form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
      await user.type(screen.getByLabelText(/phone/i), '787-555-0123');
      await user.type(screen.getByLabelText(/address/i), '123 Main St, San Juan, PR 00901');
      
      // Select mailbox
      const mailboxSelect = screen.getByLabelText(/mailbox/i);
      await user.selectOptions(mailboxSelect, 'MB001');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '787-555-0123',
          address: '123 Main St, San Juan, PR 00901',
          mailbox: 'MB001'
        }));
      });
    });

    it('should handle cancel action', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    const existingCustomer = {
      id: '123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '787-555-9876',
      address: '456 Oak Ave, Ponce, PR 00731',
      mailbox: 'MB002'
    };

    it('should populate form with existing customer data', () => {
      renderWithRouter(
        <CustomerForm 
          customer={existingCustomer} 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
        />
      );
      
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane.smith@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('787-555-9876')).toBeInTheDocument();
      expect(screen.getByDisplayValue('456 Oak Ave, Ponce, PR 00731')).toBeInTheDocument();
    });

    it('should update existing customer on submit', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <CustomerForm 
          customer={existingCustomer} 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
        />
      );
      
      // Update a field
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Janet');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /update/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          id: '123',
          firstName: 'Janet',
          lastName: 'Smith'
        }));
      });
    });
  });

  describe('VIP Customer Handling', () => {
    it('should show VIP checkbox', () => {
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/vip customer/i)).toBeInTheDocument();
    });

    it('should handle VIP customer flag', async () => {
      const user = userEvent.setup();
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Fill required fields
      await user.type(screen.getByLabelText(/first name/i), 'VIP');
      await user.type(screen.getByLabelText(/last name/i), 'Customer');
      await user.type(screen.getByLabelText(/email/i), 'vip@example.com');
      
      // Check VIP checkbox
      const vipCheckbox = screen.getByLabelText(/vip customer/i);
      await user.click(vipCheckbox);
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          isVIP: true
        }));
      });
    });
  });

  describe('Error Handling', () => {
    it('should display server errors', async () => {
      const useCustomersMock = vi.fn(() => ({
        createCustomer: vi.fn().mockRejectedValue(new Error('Server error')),
        loading: false,
        error: 'Failed to create customer'
      }));
      
      vi.mocked(useCustomers).mockImplementation(useCustomersMock);
      
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByText(/failed to create customer/i)).toBeInTheDocument();
    });

    it('should disable form during submission', async () => {
      const useCustomersMock = vi.fn(() => ({
        createCustomer: vi.fn(),
        loading: true,
        error: null
      }));
      
      vi.mocked(useCustomers).mockImplementation(useCustomersMock);
      
      renderWithRouter(<CustomerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
