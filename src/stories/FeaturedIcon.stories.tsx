import type { Meta, StoryObj } from '@storybook/react';
import { 
  Package, 
  Users, 
  Mail, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Settings,
  Bell
} from 'lucide-react';
import { 
  FeaturedIcon, 
  CaribeFeaturedIcon, 
  BusinessFeaturedIcon, 
  NotificationFeaturedIcon,
  StatusFeaturedIcon 
} from '@/components/ui/featured-icon';

const meta: Meta<typeof FeaturedIcon> = {
  title: 'PRMCMS/Featured Icons',
  component: FeaturedIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern featured icon components for the PRMCMS system. These icons are designed to be accessible, responsive, and consistent with the Caribbean-inspired design system.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide React icon component'
    },
    variant: {
      control: 'select',
      options: ['light', 'gradient', 'dark', 'outline', 'modern', 'modern-neue'],
      description: 'Visual style variant'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the icon container'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturedIcon>;

export const Default: Story = {
  args: {
    icon: Package,
    variant: 'light',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="light" />
        <p className="text-sm font-medium">Light</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="gradient" />
        <p className="text-sm font-medium">Gradient</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="dark" />
        <p className="text-sm font-medium">Dark</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="outline" />
        <p className="text-sm font-medium">Outline</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="modern" />
        <p className="text-sm font-medium">Modern</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} variant="modern-neue" />
        <p className="text-sm font-medium">Modern Neue</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available visual variants of the featured icon component.'
      }
    }
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6">
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} size="sm" />
        <p className="text-sm">Small (32px)</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} size="md" />
        <p className="text-sm">Medium (48px)</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} size="lg" />
        <p className="text-sm">Large (64px)</p>
      </div>
      <div className="text-center space-y-2">
        <FeaturedIcon icon={Package} size="xl" />
        <p className="text-sm">XL (80px)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for various UI contexts.'
      }
    }
  }
};

export const CaribeBranded: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="text-center space-y-2">
        <CaribeFeaturedIcon icon={Package} />
        <p className="text-sm font-medium">Paquetes</p>
      </div>
      <div className="text-center space-y-2">
        <CaribeFeaturedIcon icon={Users} />
        <p className="text-sm font-medium">Clientes</p>
      </div>
      <div className="text-center space-y-2">
        <CaribeFeaturedIcon icon={Mail} />
        <p className="text-sm font-medium">Correo</p>
      </div>
      <div className="text-center space-y-2">
        <CaribeFeaturedIcon icon={BarChart3} />
        <p className="text-sm font-medium">Reportes</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Caribbean-branded gradient icons for main application features.'
      }
    }
  }
};

export const BusinessIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="text-center space-y-2">
        <BusinessFeaturedIcon icon={Package} />
        <p className="text-sm font-medium">Operations</p>
      </div>
      <div className="text-center space-y-2">
        <BusinessFeaturedIcon icon={Users} />
        <p className="text-sm font-medium">Staff</p>
      </div>
      <div className="text-center space-y-2">
        <BusinessFeaturedIcon icon={Settings} />
        <p className="text-sm font-medium">Settings</p>
      </div>
      <div className="text-center space-y-2">
        <BusinessFeaturedIcon icon={BarChart3} />
        <p className="text-sm font-medium">Analytics</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Professional business-style icons for administrative functions.'
      }
    }
  }
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="text-center space-y-2">
        <StatusFeaturedIcon icon={CheckCircle} status="success" />
        <p className="text-sm font-medium text-green-600">Success</p>
      </div>
      <div className="text-center space-y-2">
        <StatusFeaturedIcon icon={AlertTriangle} status="warning" />
        <p className="text-sm font-medium text-amber-600">Warning</p>
      </div>
      <div className="text-center space-y-2">
        <StatusFeaturedIcon icon={XCircle} status="error" />
        <p className="text-sm font-medium text-red-600">Error</p>
      </div>
      <div className="text-center space-y-2">
        <StatusFeaturedIcon icon={Info} status="info" />
        <p className="text-sm font-medium text-blue-600">Info</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic status icons with appropriate color coding for different states.'
      }
    }
  }
};

export const NotificationIcons: Story = {
  render: () => (
    <div className="flex gap-6 p-6">
      <div className="text-center space-y-2">
        <NotificationFeaturedIcon icon={Bell} />
        <p className="text-sm font-medium">Notifications</p>
      </div>
      <div className="text-center space-y-2">
        <NotificationFeaturedIcon icon={Mail} />
        <p className="text-sm font-medium">Messages</p>
      </div>
      <div className="text-center space-y-2">
        <NotificationFeaturedIcon icon={AlertTriangle} />
        <p className="text-sm font-medium">Alerts</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Subtle outlined style icons perfect for notifications and non-intrusive UI elements.'
      }
    }
  }
};

export const InDashboardCard: Story = {
  render: () => (
    <div className="max-w-sm mx-auto p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <CaribeFeaturedIcon icon={Package} size="sm" />
        <div>
          <h5 className="font-semibold text-gray-900">Paquetes Recibidos</h5>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-500">+12% vs ayer</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example usage in a dashboard card with metrics and branding.'
      }
    }
  }
};

export const InNavigationMenu: Story = {
  render: () => (
    <div className="max-w-xs mx-auto space-y-2 p-4">
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        <BusinessFeaturedIcon icon={Package} size="sm" />
        <span className="font-medium text-gray-700">Gestión de Paquetes</span>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        <BusinessFeaturedIcon icon={Users} size="sm" />
        <span className="font-medium text-gray-700">Base de Clientes</span>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        <BusinessFeaturedIcon icon={BarChart3} size="sm" />
        <span className="font-medium text-gray-700">Análisis y Reportes</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example usage in navigation menu items with bilingual labels.'
      }
    }
  }
};
