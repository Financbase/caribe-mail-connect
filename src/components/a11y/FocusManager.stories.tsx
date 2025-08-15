import type { Meta, StoryObj } from '@storybook/react';
import { FocusManagerProvider, useFocusManager } from './FocusManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';

const meta: Meta<typeof FocusManagerProvider> = {
  title: 'Caribbean/FocusManager',
  component: FocusManagerProvider,
  parameters: {
    docs: {
      description: {
        component: `
Comprehensive focus management system for PRMCMS with Caribbean accessibility features.
Provides focus trapping, restoration, roving tabindex, and skip links functionality.

**Features:**
- Focus trap for modal dialogs and overlays
- Focus restoration when modals close
- Roving tabindex for complex UI components
- Skip link management for keyboard navigation
- ARIA-compliant focus indicators with Caribbean theming
- High contrast mode support

**Usage:**
Wrap your application with FocusManagerProvider and use the useFocusManager hook
to control focus behavior throughout your application.
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'focus-trap',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FocusManagerProvider>;

// Demo component showing focus trap functionality
function FocusTrapDemo() {
  const { trapFocus, restoreFocus } = useFocusManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      if (modalRef.current) {
        trapFocus(modalRef.current);
      }
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    restoreFocus();
  };

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Focus Trap Demo
      </h3>
      
      <div className="space-y-2">
        <Button onClick={openModal}>
          Open Modal (Focus Trap)
        </Button>
        <Input placeholder="Clickable input outside modal" />
        <Button variant="outline">
          Another button outside modal
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            id="modal-container"
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none"
            tabIndex={-1}
          >
            <h4 className="text-lg font-semibold mb-4">
              Trapped Focus Modal
            </h4>
            <p className="text-gray-600 mb-4">
              Focus is trapped within this modal. Tab navigation will cycle through only these elements.
            </p>
            <div className="space-y-2">
              <Input placeholder="First input in modal" />
              <Input placeholder="Second input in modal" />
              <div className="flex gap-2">
                <Button variant="outline">
                  Action 1
                </Button>
                <Button onClick={closeModal}>
                  Close Modal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Demo component showing roving tabindex
function RovingTabindexDemo() {
  const { setRovingTabindex } = useFocusManager();
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    'Inbox - 15 packages',
    'Processing - 8 packages', 
    'Out for delivery - 23 packages',
    'Delivered - 156 packages',
    'Exception - 2 packages'
  ];

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = index === 0 ? items.length - 1 : index - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }
    
    setActiveIndex(newIndex);
    setRovingTabindex(`item-${newIndex}`);
  };

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Roving Tabindex Demo
      </h3>
      <p className="text-sm text-gray-600">
        Use arrow keys, Home, and End to navigate through the package status list.
      </p>
      
      <div 
        role="listbox" 
        aria-label="Package status overview"
        className="border rounded-lg overflow-hidden"
      >
        {items.map((item, index) => (
          <div
            key={index}
            id={`item-${index}`}
            role="option"
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
            className={`p-3 border-b last:border-b-0 focus:outline-none focus:ring-2 focus:ring-[#0B5394] focus:bg-[#0B5394]/10 cursor-pointer
              ${activeIndex === index ? 'bg-[#0B5394]/5 border-l-4 border-l-[#0B5394]' : 'hover:bg-gray-50'}
            `}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => {
              setActiveIndex(index);
              setRovingTabindex(`item-${index}`);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo component showing skip links
function SkipLinksDemo() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Skip Links Demo
      </h3>
      <p className="text-sm text-gray-600">
        Press Tab to see skip links appear. These help keyboard users navigate quickly.
      </p>
      
      <div className="space-y-4">
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#0B5394] text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <a 
          href="#package-search"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 bg-[#FF6B35] text-white px-4 py-2 rounded-md z-50"
        >
          Skip to package search
        </a>
        
        <div id="main-content" className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Main Content Area</h4>
          <p className="text-gray-600">
            This is where the main application content would be displayed.
          </p>
        </div>
        
        <div id="package-search" className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Package Search</h4>
          <Input placeholder="Search packages..." />
        </div>
      </div>
    </div>
  );
}

export const FocusTrap: Story = {
  render: () => (
    <FocusManagerProvider>
      <FocusTrapDemo />
    </FocusManagerProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates focus trapping functionality for modal dialogs. When the modal opens,
focus is trapped within it and cycles through only the modal's interactive elements.
When closed, focus returns to the trigger button.
        `,
      },
    },
  },
};

export const RovingTabindex: Story = {
  render: () => (
    <FocusManagerProvider>
      <RovingTabindexDemo />
    </FocusManagerProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows roving tabindex implementation for navigating lists with arrow keys.
Only one item is in the tab order at a time, improving keyboard navigation efficiency.
Use arrow keys, Home, and End to navigate.
        `,
      },
    },
  },
};

export const SkipLinks: Story = {
  render: () => (
    <FocusManagerProvider>
      <SkipLinksDemo />
    </FocusManagerProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates skip links that appear when keyboard users press Tab.
These allow quick navigation to important page sections, essential for screen reader users.
        `,
      },
    },
  },
};

export const CompleteDemo: Story = {
  render: () => {
    function CompleteAccessibilityDemo() {
      const [showModal, setShowModal] = useState(false);
      const [activeItem, setActiveItem] = useState(0);
      const { trapFocus, restoreFocus, setRovingTabindex } = useFocusManager();

      const packageItems = [
        'Urgent: Express delivery package',
        'VIP: Premium customer package',
        'Standard: Regular delivery package',
        'Hold: Customer pickup required'
      ];

      const openPackageModal = () => {
        setShowModal(true);
        setTimeout(() => trapFocus('package-modal'), 100);
      };

      const closePackageModal = () => {
        setShowModal(false);
        restoreFocus();
      };

      return (
        <div className="space-y-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Focus Management Demo
          </h3>
          
          {/* Skip Links */}
          <div className="space-y-2">
            <a 
              href="#package-list"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#0B5394] text-white px-4 py-2 rounded-md z-50"
            >
              Skip to package list
            </a>
            <a 
              href="#actions"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 bg-[#FF6B35] text-white px-4 py-2 rounded-md z-50"
            >
              Skip to actions
            </a>
          </div>

          {/* Package List with Roving Tabindex */}
          <div id="package-list" className="space-y-2">
            <h4 className="font-medium text-gray-700">Package Queue (Use arrow keys)</h4>
            <div role="listbox" className="border rounded-lg overflow-hidden">
              {packageItems.map((item, index) => (
                <div
                  key={index}
                  id={`package-${index}`}
                  role="option"
                  aria-selected={activeItem === index}
                  tabIndex={activeItem === index ? 0 : -1}
                  className={`p-3 border-b last:border-b-0 focus:outline-none focus:ring-2 focus:ring-[#0B5394] cursor-pointer
                    ${activeItem === index ? 'bg-[#0B5394]/10 border-l-4 border-l-[#0B5394]' : 'hover:bg-gray-50'}
                  `}
                  onKeyDown={(e) => {
                    let newIndex = activeItem;
                    switch (e.key) {
                      case 'ArrowDown':
                        e.preventDefault();
                        newIndex = (activeItem + 1) % packageItems.length;
                        break;
                      case 'ArrowUp':
                        e.preventDefault();
                        newIndex = activeItem === 0 ? packageItems.length - 1 : activeItem - 1;
                        break;
                      case 'Enter':
                      case ' ':
                        e.preventDefault();
                        openPackageModal();
                        return;
                    }
                    setActiveItem(newIndex);
                    setRovingTabindex(`package-${newIndex}`);
                  }}
                  onClick={() => {
                    setActiveItem(index);
                    setRovingTabindex(`package-${index}`);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div id="actions" className="space-y-2">
            <h4 className="font-medium text-gray-700">Actions</h4>
            <div className="space-y-2">
              <Button onClick={openPackageModal} className="w-full bg-[#0B5394] hover:bg-[#0B5394]/90">
                Process Selected Package
              </Button>
              <Button variant="outline" className="w-full">
                Print Package Labels
              </Button>
            </div>
          </div>

          {/* Modal with Focus Trap */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div 
                id="package-modal"
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none"
                tabIndex={-1}
              >
                <h4 className="text-lg font-semibold mb-4">
                  Process Package
                </h4>
                <p className="text-gray-600 mb-4">
                  {packageItems[activeItem]}
                </p>
                <div className="space-y-3">
                  <Input placeholder="Tracking number" />
                  <Input placeholder="Customer notification" />
                  <div className="flex gap-2">
                    <Button onClick={closePackageModal} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={closePackageModal} className="flex-1 bg-[#2ECC71] hover:bg-[#2ECC71]/90">
                      Process
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <FocusManagerProvider>
        <CompleteAccessibilityDemo />
      </FocusManagerProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
Complete demonstration combining skip links, roving tabindex, and focus trapping
in a realistic PRMCMS package processing interface. Shows how all focus management
features work together for optimal keyboard accessibility.
        `,
      },
    },
  },
};
