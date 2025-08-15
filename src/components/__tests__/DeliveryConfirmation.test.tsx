import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import DeliveryConfirmation from '../DeliveryConfirmation';
import { Package as PackageType, Customer } from '@/data/mockData';

describe('DeliveryConfirmation', () => {
  const mockOnConfirmDelivery = vi.fn();
  
  const mockPackage: PackageType = {
    id: '123',
    trackingNumber: 'PKG123456',
    carrier: 'USPS',
    status: 'ready',
    customerId: 'cust-1',
    receivedDate: new Date().toISOString(),
    weight: 2.5,
    dimensions: { length: 10, width: 8, height: 6 },
    location: 'A1',
    specialHandling: false,
    type: 'standard'
  };
  
  const mockCustomer: Customer = {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0100',
    mailboxNumber: 'MB001',
    address: '123 Main St',
    notificationPreferences: {
      email: true,
      sms: false,
      whatsapp: false,
      language: 'en'
    },
    registrationDate: new Date().toISOString(),
    status: 'active',
    idNumber: '123456789',
    idType: 'driver_license',
    notes: '',
    monthlyFee: 25
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render confirm delivery button', () => {
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      expect(screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i })).toBeInTheDocument();
    });

    it('should open dialog when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      const confirmButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText(/delivery confirmation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Package Details Display', () => {
    it('should display package information in dialog', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      const confirmButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('PKG123456')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('MB001')).toBeInTheDocument();
        expect(screen.getByText('USPS')).toBeInTheDocument();
      });
    });
  });

  describe('Signature Requirement', () => {
    it('should require customer signature before confirmation', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      // Open dialog
      const openButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(openButton);
      
      // Try to confirm without signature
      const confirmButton = await screen.findByRole('button', { name: /confirm & notify/i });
      await user.click(confirmButton);
      
      // Should not call the function
      expect(mockOnConfirmDelivery).not.toHaveBeenCalled();
    });

    it('should confirm delivery with signature and notes', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      // Open dialog
      const openButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(openButton);
      
      // Enter signature
      const signatureInput = await screen.findByLabelText(/customer name.*confirmation/i);
      await user.type(signatureInput, 'John Doe');
      
      // Add notes
      const notesInput = screen.getByLabelText(/delivery notes/i);
      await user.type(notesInput, 'Left at front desk');
      
      // Confirm delivery
      const confirmButton = screen.getByRole('button', { name: /confirm & notify/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockOnConfirmDelivery).toHaveBeenCalledWith('123', 'Left at front desk');
      });
    });
  });

  describe('Notification Preview', () => {
    it('should show notification preview in English', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      const confirmButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Hi John Doe! Your package PKG123456 has been delivered/i)).toBeInTheDocument();
      });
    });

    it('should show notification preview in Spanish', async () => {
      const user = userEvent.setup();
      const spanishCustomer = {
        ...mockCustomer,
        notificationPreferences: {
          ...mockCustomer.notificationPreferences,
          language: 'es' as const
        }
      };
      
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={spanishCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      const confirmButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText(/¡Hola John Doe! Tu paquete PKG123456 ha sido entregado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Control', () => {
    it('should close dialog on cancel', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      // Open dialog
      const openButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(openButton);
      
      // Verify dialog is open
      expect(screen.getByText(/delivery confirmation/i)).toBeInTheDocument();
      
      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByText(/delivery confirmation/i)).not.toBeInTheDocument();
      });
    });

    it('should close dialog after successful confirmation', async () => {
      const user = userEvent.setup();
      render(
        <DeliveryConfirmation 
          package={mockPackage}
          customer={mockCustomer}
          onConfirmDelivery={mockOnConfirmDelivery}
        />
      );
      
      // Open dialog
      const openButton = screen.getByRole('button', { name: /confirm delivery|confirmar entrega/i });
      await user.click(openButton);
      
      // Enter signature
      const signatureInput = await screen.findByLabelText(/customer name.*confirmation/i);
      await user.type(signatureInput, 'John Doe');
      
      // Confirm
      const confirmButton = screen.getByRole('button', { name: /confirm & notify/i });
      await user.click(confirmButton);
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByText(/delivery confirmation/i)).not.toBeInTheDocument();
      });
    });
  });
});
