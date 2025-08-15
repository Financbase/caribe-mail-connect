import type { Meta, StoryObj } from '@storybook/react';

// CSS Documentation Story showcasing Caribbean theming
const CSSDocumentation = () => {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        PRMCMS Caribbean Design System
      </h1>

      {/* Color Palette */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Caribbean Color Palette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-full h-24 bg-[#0B5394] rounded-lg"></div>
            <div className="text-center">
              <div className="font-medium">Ocean Blue</div>
              <div className="text-sm text-gray-600">#0B5394</div>
              <div className="text-xs text-gray-500">Primary actions, trust</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 bg-[#FF6B35] rounded-lg"></div>
            <div className="text-center">
              <div className="font-medium">Sunrise Orange</div>
              <div className="text-sm text-gray-600">#FF6B35</div>
              <div className="text-xs text-gray-500">Urgent, attention</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 bg-[#2ECC71] rounded-lg"></div>
            <div className="text-center">
              <div className="font-medium">Palm Green</div>
              <div className="text-sm text-gray-600">#2ECC71</div>
              <div className="text-xs text-gray-500">Success, completion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Indicators */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Accessibility Focus Indicators
        </h2>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-[#0B5394] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:ring-offset-2">
            Caribbean Focused Button
          </button>
          <input 
            type="text" 
            placeholder="Focus visible input"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:border-transparent"
          />
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-600">
              All focus indicators use a 2px Caribbean ocean blue ring with 2px offset for optimal visibility.
              High contrast mode provides enhanced visibility with increased ring width.
            </p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Bilingual Typography
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Spanish Primary</h3>
            <p className="text-gray-700">
              Escanear código de barras del paquete para continuar con el proceso de ingreso.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium mb-2">English Secondary</h3>
            <p className="text-gray-700">
              Scan package barcode to continue with intake process.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pattern:</strong> Spanish text / English text for all user-facing strings.
              Spanish text is 20-25% longer on average, requiring flexible layouts.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Touch Targets */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Mobile Touch Targets
        </h2>
        <div className="space-y-4">
          <button className="w-full min-h-[48px] bg-[#0B5394] text-white rounded-lg text-lg">
            48px Minimum Touch Target
          </button>
          <button className="w-full min-h-[56px] bg-[#FF6B35] text-white rounded-lg text-lg">
            56px Recommended for Primary Actions
          </button>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Mobile First:</strong> All interactive elements meet 48px minimum size.
              Primary actions use 56px for better thumb reach on larger phones.
            </p>
          </div>
        </div>
      </section>

      {/* Animation Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Caribbean Animations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-2">
              <div className="animate-bounce">✅</div>
              <span className="text-green-800">Success Animation</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              Warm green gradient with gentle bounce for positive feedback
            </p>
          </div>
          <div className="p-4 border border-red-200 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">❌</div>
              <span className="text-red-800">Error Animation</span>
            </div>
            <p className="text-sm text-red-700 mt-2">
              Coral red gradient with pulse for attention-grabbing alerts
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Status */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Implementation Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Global focus-visible styles with Caribbean theming</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>ARIA live regions with bilingual announcements</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Caribbean feedback animations with accessibility</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Focus management with trap and restore</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Translation enforcement with ESLint rules</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Accessibility testing infrastructure</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🔄</span>
            <span>Storybook component documentation (in progress)</span>
          </div>
        </div>
      </section>

      {/* Cultural Design Notes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Puerto Rico Cultural Context
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Technical Considerations</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 3x monthly power outages</li>
              <li>• 61% mobile usage</li>
              <li>• Slow 3G in rural areas</li>
              <li>• Offline-first design required</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Cultural Preferences</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Warm, personal interface tone</li>
              <li>• Relationship-based interactions</li>
              <li>• Spanish-first language approach</li>
              <li>• Visual warmth over minimalism</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

const meta: Meta<typeof CSSDocumentation> = {
  title: 'Caribbean/Design System',
  component: CSSDocumentation,
  parameters: {
    docs: {
      description: {
        component: `
Complete overview of the PRMCMS Caribbean Design System implementation.
This documents all the accessibility, theming, and cultural considerations
built into the component library.

**Key Features:**
- Caribbean-inspired color palette for Puerto Rico context
- WCAG 2.1 AA compliant accessibility features
- Bilingual Spanish/English support with proper text expansion handling
- Mobile-first design with 48px+ touch targets
- Offline-resilient animations and feedback
- Cultural warmth in UI patterns and interactions
        `,
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CSSDocumentation>;

export const Overview: Story = {
  render: () => <CSSDocumentation />,
  parameters: {
    docs: {
      description: {
        story: `
Complete design system overview showing all implemented Caribbean UI patterns,
accessibility features, and cultural considerations for PRMCMS.
        `,
      },
    },
  },
};
