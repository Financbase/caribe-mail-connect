import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackAnimation } from './FeedbackAnimation';
import { AriaLiveProvider } from '../a11y/AriaLiveProvider';

const meta: Meta<typeof FeedbackAnimation> = {
  title: 'Caribbean/FeedbackAnimation',
  component: FeedbackAnimation,
  decorators: [
    (Story) => (
      <AriaLiveProvider>
        <div className="p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
          <Story />
        </div>
      </AriaLiveProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Caribbean-themed feedback animations for PRMCMS. Features warm, ocean-inspired 
gradients with haptic feedback indicators and ARIA live region integration for 
accessibility.

**Features:**
- Success animations with Caribbean palm green gradients
- Error animations with warm coral red tones
- Loading states with ocean blue pulses
- ARIA live announcements in Spanish/English
- Reduced motion support for accessibility
- Haptic feedback patterns for mobile devices
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-live-region',
            enabled: true,
          },
          {
            id: 'reduced-motion',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackAnimation>;

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Paquete escaneado exitosamente / Package scanned successfully',
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Success feedback with Caribbean palm green gradient and checkmark animation.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Error al escanear paquete / Package scan failed',
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error feedback with warm coral red gradient and warning icon.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Verificar información del cliente / Verify customer information',
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning feedback with warm yellow gradient for attention-needed states.',
      },
    },
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Procesando paquete... / Processing package...',
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Info feedback with ocean blue gradient and informational icon.',
      },
    },
  },
};

export const WithCustomDuration: Story = {
  args: {
    type: 'success',
    message: 'Cliente notificado / Customer notified',
    visible: true,
    duration: 5000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Success feedback with extended 5-second duration for important operations.',
      },
    },
  },
};

export const BilingualDemo: Story = {
  args: {
    type: 'success',
    message: 'Buzón asignado correctamente / Mailbox assigned successfully',
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates bilingual messaging pattern used throughout PRMCMS.',
      },
    },
  },
};
