import type { Meta, StoryObj } from '@storybook/react';
import Phase2IntegrationShowcase from '../components/examples/Phase2IntegrationShowcase';

const meta: Meta<typeof Phase2IntegrationShowcase> = {
  title: 'PRMCMS/Integration/Phase 2 Showcase',
  component: Phase2IntegrationShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Phase 2 Integration Showcase

Advanced PRMCMS components showcasing:

## 🚀 New Components Added

### 1. Package Activity Feed
- **Visual timeline** for package tracking
- **Real-time updates** with Caribbean styling
- **Interactive elements** for notes and photos
- **Bilingual support** with Spanish-first approach

### 2. PRMCMS Metrics Dashboard  
- **Real-time KPIs** with business intelligence
- **Caribbean-themed charts** and visualizations
- **Time range selection** (today, week, month, year)
- **Integrated Untitled UI metrics** with custom branding

### 3. Messaging Center
- **Real-time chat** with customers
- **File sharing** and multimedia support
- **Quick replies** for common responses
- **VIP customer recognition** with special indicators

### 4. Advanced Analytics
- **Predictive insights** for business decisions
- **Performance optimization** suggestions
- **ROI tracking** and measurement
- **Trend analysis** with actionable recommendations

## 🎨 Design Philosophy

- **Caribbean Warmth**: Ocean Blue → Sunrise Orange → Palm Green
- **Spanish-First**: Puerto Rico cultural adaptation
- **Mobile-Optimized**: Touch-friendly for field operations
- **Enterprise-Grade**: Professional appearance for business credibility

## 📱 Real-World Applications

- **Package Tracking**: Complete transparency for customers
- **Operations Management**: Data-driven decision making
- **Customer Service**: Streamlined communication workflows
- **Business Intelligence**: Performance monitoring and optimization

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
        story: 'Complete Phase 2 showcase in Spanish demonstrating all advanced components with Caribbean theming.'
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
        story: 'English version of the Phase 2 integration showcase.'
      }
    }
  }
};

export const MobileView: Story = {
  args: {
    language: 'es'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive design and touch-friendly interactions.'
      }
    }
  }
};

export const TabletView: Story = {
  args: {
    language: 'es'
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view demonstrating adaptive layout for medium-sized screens.'
      }
    }
  }
};

// Individual component stories
export const ActivityFeedFocus: Story = {
  args: {
    language: 'es'
  },
  play: async ({ canvasElement }) => {
    // Focus on activity feed tab
    const activityTab = canvasElement.querySelector('[data-tab="activityFeed"]');
    if (activityTab) {
      (activityTab as HTMLElement).click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the Package Activity Feed with timeline visualization.'
      }
    }
  }
};

export const MetricsDashboardFocus: Story = {
  args: {
    language: 'es'
  },
  play: async ({ canvasElement }) => {
    // Focus on metrics tab
    const metricsTab = canvasElement.querySelector('[data-tab="metrics"]');
    if (metricsTab) {
      (metricsTab as HTMLElement).click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the PRMCMS Metrics Dashboard with real-time KPIs.'
      }
    }
  }
};

export const MessagingCenterFocus: Story = {
  args: {
    language: 'es'
  },
  play: async ({ canvasElement }) => {
    // Focus on messaging tab
    const messagingTab = canvasElement.querySelector('[data-tab="messaging"]');
    if (messagingTab) {
      (messagingTab as HTMLElement).click();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the Messaging Center with customer communication interface.'
      }
    }
  }
};
