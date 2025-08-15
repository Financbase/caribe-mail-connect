import type { Meta, StoryObj } from '@storybook/react';
import { AriaLiveProvider, useAriaLive } from './AriaLiveProvider';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const meta: Meta<typeof AriaLiveProvider> = {
  title: 'Caribbean/AriaLiveProvider',
  component: AriaLiveProvider,
  parameters: {
    docs: {
      description: {
        component: `
ARIA Live Regions provider for PRMCMS with bilingual announcements.
Provides polite and assertive live regions for announcing status updates
and critical alerts in both Spanish and English.

**Features:**
- Polite announcements for status updates
- Assertive announcements for errors/alerts
- Bilingual Caribbean mail operation contexts
- Package scanning and customer interaction feedback
- Automatic queue management to prevent announcement conflicts

**Usage:**
Wrap your application or component tree with AriaLiveProvider and use the
useAriaLive hook to make announcements.
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-live',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AriaLiveProvider>;

// Demo component to show live region functionality
function AriaLiveDemo() {
  const { announceStatus, announceAlert } = useAriaLive();
  const [counter, setCounter] = useState(0);

  const handleStatusAnnouncement = () => {
    setCounter(c => c + 1);
    announceStatus(`Paquete #${counter + 1} procesado / Package #${counter + 1} processed`);
  };

  const handleAlertAnnouncement = () => {
    announceAlert('¡Atención! Error de conexión / Attention! Connection error');
  };

  const handlePackageScan = () => {
    announceStatus('Código de barras escaneado exitosamente / Barcode scanned successfully');
  };

  const handleCustomerUpdate = () => {
    announceStatus('Cliente notificado por SMS / Customer notified via SMS');
  };

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        ARIA Live Region Demo
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Status Announcements (Polite)</h4>
          <div className="space-y-2">
            <Button onClick={handleStatusAnnouncement} variant="outline" className="w-full">
              Process Package ({counter})
            </Button>
            <Button onClick={handlePackageScan} variant="outline" className="w-full">
              Scan Package
            </Button>
            <Button onClick={handleCustomerUpdate} variant="outline" className="w-full">
              Notify Customer
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Alert Announcements (Assertive)</h4>
          <div className="space-y-2">
            <Button onClick={handleAlertAnnouncement} variant="destructive" className="w-full">
              Trigger Error Alert
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Screen Reader Test:</strong> Use a screen reader to test the announcements above.
          Status announcements will be polite (non-interrupting) while alerts will be assertive (interrupting).
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <AriaLiveProvider>
      <AriaLiveDemo />
    </AriaLiveProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Interactive demo of ARIA live regions. Click the buttons to test different types of announcements.
The announcements are bilingual (Spanish/English) and follow Caribbean mail operation patterns.
        `,
      },
    },
  },
};

export const BilingualAnnouncements: Story = {
  render: () => {
    function BilingualDemo() {
      const { announceStatus } = useAriaLive();
      
      const mailOperations = [
        'Paquete asignado al buzón 101 / Package assigned to mailbox 101',
        'Cliente VIP identificado / VIP customer identified',
        'Notificación enviada por WhatsApp / WhatsApp notification sent',
        'Entrega programada para mañana / Delivery scheduled for tomorrow',
        'Documento firmado digitalmente / Document digitally signed'
      ];

      const [currentIndex, setCurrentIndex] = useState(0);

      const handleNextAnnouncement = () => {
        const message = mailOperations[currentIndex];
        announceStatus(message);
        setCurrentIndex((currentIndex + 1) % mailOperations.length);
      };

      return (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Caribbean Mail Operations Demo
          </h3>
          
          <Button onClick={handleNextAnnouncement} className="w-full">
            Announce Next Operation
          </Button>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Current message:</strong> {mailOperations[currentIndex]}
            </p>
          </div>
        </div>
      );
    }

    return (
      <AriaLiveProvider>
        <BilingualDemo />
      </AriaLiveProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates bilingual announcements for typical Caribbean mail operations.
All messages follow the pattern of "Spanish text / English text" for consistency.
        `,
      },
    },
  },
};
