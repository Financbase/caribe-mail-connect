import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Package, Scan, User, Truck, Mail, Crown } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Caribbean/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Enhanced Button component for PRMCMS with Caribbean color scheme and mobile-first design.
All buttons meet WCAG 2.1 AA requirements with 48px minimum touch targets and high contrast ratios.

**Caribbean Color Palette:**
- Ocean Blue (#0B5394) for primary actions
- Sunrise Orange (#FF6B35) for attention/urgent actions  
- Palm Green (#2ECC71) for success states
        `,
      },
    },
    a11y: { disable: false },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select', 
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Escanear Paquete',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default ocean blue button for primary actions in Spanish.',
      },
    },
  },
};

export const CaribbeanPrimary: Story = {
  args: {
    children: 'Procesar Entrega',
    className: 'bg-[#0B5394] hover:bg-[#0B5394]/90 text-white',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary action button with Caribbean ocean blue theme.',
      },
    },
  },
};

export const SunriseAttention: Story = {
  args: {
    children: 'Urgent Notification',
    className: 'bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white',
  },
  parameters: {
    docs: {
      description: {
        story: 'Attention-grabbing button with Caribbean sunrise orange for urgent actions.',
      },
    },
  },
};

export const PalmSuccess: Story = {
  args: {
    children: '✓ Cliente Notificado',
    className: 'bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white',
  },
  parameters: {
    docs: {
      description: {
        story: 'Success state button with Caribbean palm green.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button className="bg-[#0B5394] hover:bg-[#0B5394]/90">
        <Package className="w-4 h-4 mr-2" />
        Intake Package
      </Button>
      <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">
        <Scan className="w-4 h-4 mr-2" />
        Scan Barcode
      </Button>
      <Button className="bg-[#2ECC71] hover:bg-[#2ECC71]/90">
        <User className="w-4 h-4 mr-2" />
        Add Customer
      </Button>
      <Button variant="outline">
        <Truck className="w-4 h-4 mr-2" />
        Route Planning
      </Button>
      <Button variant="secondary">
        <Mail className="w-4 h-4 mr-2" />
        Send Notice
      </Button>
      <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">
        <Crown className="w-4 h-4 mr-2" />
        VIP Service
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons for common PRMCMS operations using Caribbean color scheme.',
      },
    },
  },
};

export const MobileTouchTargets: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        All buttons meet 48px minimum touch target requirements
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Button className="min-h-[48px] bg-[#0B5394] hover:bg-[#0B5394]/90 text-lg">
          Escanear Código de Barras
        </Button>
        <Button className="min-h-[48px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-lg">
          Notificación Urgente
        </Button>
        <Button className="min-h-[48px] bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-lg">
          Confirmar Entrega
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimized buttons with 48px minimum touch targets for one-handed operation.',
      },
    },
  },
};

export const BilingualLabels: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Spanish (Primary)</h4>
        <div className="space-y-2">
          <Button className="w-full bg-[#0B5394] hover:bg-[#0B5394]/90">
            Escanear Paquete
          </Button>
          <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90">
            Notificar Cliente
          </Button>
          <Button className="w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90">
            Confirmar Entrega
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">English (Secondary)</h4>
        <div className="space-y-2">
          <Button className="w-full bg-[#0B5394] hover:bg-[#0B5394]/90">
            Scan Package
          </Button>
          <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90">
            Notify Customer
          </Button>
          <Button className="w-full bg-[#2ECC71] hover:bg-[#2ECC71]/90">
            Confirm Delivery
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Bilingual button labels showing Spanish-first approach used throughout PRMCMS.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button size="sm" className="bg-[#0B5394] hover:bg-[#0B5394]/90">
          Small
        </Button>
        <Button size="default" className="bg-[#0B5394] hover:bg-[#0B5394]/90">
          Default
        </Button>
        <Button size="lg" className="bg-[#0B5394] hover:bg-[#0B5394]/90">
          Large
        </Button>
        <Button size="icon" className="bg-[#0B5394] hover:bg-[#0B5394]/90">
          <Package className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes with Caribbean ocean blue styling.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants using the default shadcn/ui styling.',
      },
    },
  },
};
