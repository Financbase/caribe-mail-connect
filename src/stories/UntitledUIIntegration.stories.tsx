import type { Meta, StoryObj } from '@storybook/react';
import UntitledUIIntegrationShowcase from '../components/examples/UntitledUIIntegrationShowcase';

const meta: Meta<typeof UntitledUIIntegrationShowcase> = {
  title: 'PRMCMS/Integration/Untitled UI Showcase',
  component: UntitledUIIntegrationShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Untitled UI Integration Showcase

A comprehensive demonstration of how Untitled UI components integrate with the PRMCMS Caribbean design system.

## Featured Components

- **Modals**: Package processing forms with Caribbean branding
- **Tables**: Data display with Spanish/English support
- **Date Pickers**: Localized date selection
- **File Uploads**: Document management interface
- **Command Menus**: Quick search and actions
- **Empty States**: User-friendly no-data scenarios
- **Loading Indicators**: Professional loading states

## Design Integration

All components are customized with:
- Caribbean color palette (Ocean Blue → Sunrise Orange → Palm Green)
- Spanish-first localization
- Mobile-optimized touch targets
- WCAG 2.1 AA accessibility compliance

## Real-World Usage

This showcase demonstrates actual PRMCMS workflows:
- Package intake and processing
- Customer data management
- Delivery scheduling
- Document handling
- Search and navigation
        `
      }
    }
  },
  argTypes: {
    language: {
      control: 'select',
      options: ['es', 'en'],
      description: 'Interface language (Spanish/English)'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    language: 'es'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default showcase in Spanish showing all integrated Untitled UI components with Caribbean theming.'
      }
    }
  }
};

export const English: Story = {
  args: {
    language: 'en'
  },
  parameters: {
    docs: {
      description: {
        story: 'English version of the integration showcase.'
      }
    }
  }
};

export const SpanishMobile: Story = {
  args: {
    language: 'es'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized view in Spanish, demonstrating responsive design and touch-friendly interactions.'
      }
    }
  }
};

export const EnglishTablet: Story = {
  args: {
    language: 'en'
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view in English showing how components adapt to medium-sized screens.'
      }
    }
  }
};

// Interactive workflow stories
export const PackageProcessingFlow: Story = {
  args: {
    language: 'es'
  },
  play: async ({ canvasElement }) => {
    // This would be enhanced with @storybook/test interactions
    console.log('Package processing workflow demo');
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the complete package processing workflow using integrated components.'
      }
    }
  }
};

export const CustomerManagementFlow: Story = {
  args: {
    language: 'es'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows customer data management using tables, modals, and forms with Caribbean design.'
      }
    }
  }
};
