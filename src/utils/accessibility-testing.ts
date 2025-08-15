import { configureAxe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Configure axe for Caribbean Mail System requirements
export const caribbeanAxeConfig = configureAxe({
  rules: {
    // Enable all WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-visible': { enabled: true },
    
    // Spanish language support
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'valid-lang': { enabled: true },
    
    // Form accessibility (critical for mail operations)
    'label': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'fieldset-legend': { enabled: true },
    
    // Navigation and landmarks
    'landmark-one-main': { enabled: true },
    'landmark-complementary-is-top-level': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'bypass': { enabled: true },
    
    // Interactive elements
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'role-support-aria': { enabled: true },
    
    // Images and media
    'image-alt': { enabled: true },
    'image-redundant-alt': { enabled: true },
    
    // Tables (important for data display)
    'table-headers': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    
    // Live regions
    'aria-live-region': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    
    // Mobile accessibility
    'target-size': { enabled: true },
    'focus-order-semantics': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
});

// Helper functions for testing Caribbean components
export const testAccessibility = async (container: Element) => {
  const results = await caribbeanAxeConfig(container);
  expect(results).toHaveNoViolations();
  return results;
};

// Test keyboard navigation
export const testKeyboardNavigation = (container: Element) => {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  return {
    count: focusableElements.length,
    elements: Array.from(focusableElements),
    hasTabTrap: checkTabTrap(container),
    hasSkipLinks: checkSkipLinks(container)
  };
};

// Check for tab trap in modals/dialogs
const checkTabTrap = (container: Element): boolean => {
  const modal = container.querySelector('[role="dialog"], [aria-modal="true"]');
  if (!modal) return true; // No modal, no trap needed
  
  const focusableInModal = modal.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  return focusableInModal.length > 0;
};

// Check for skip links
const checkSkipLinks = (container: Element): boolean => {
  const skipLinks = container.querySelectorAll('a[href^="#"], .skip-link');
  return skipLinks.length > 0;
};

// Test Spanish content accessibility
export const testSpanishAccessibility = (container: Element) => {
  const spanishElements = container.querySelectorAll('[lang="es"], [lang="es-PR"]');
  const hasSpanishContent = container.textContent?.includes('á') || 
                           container.textContent?.includes('é') ||
                           container.textContent?.includes('í') ||
                           container.textContent?.includes('ó') ||
                           container.textContent?.includes('ú') ||
                           container.textContent?.includes('ñ');
  
  return {
    hasSpanishElements: spanishElements.length > 0,
    hasSpanishContent,
    isProperlyMarked: hasSpanishContent ? spanishElements.length > 0 : true
  };
};

// Test mobile accessibility
export const testMobileAccessibility = (container: Element) => {
  const buttons = container.querySelectorAll('button, [role="button"]');
  const links = container.querySelectorAll('a[href]');
  
  const touchTargets = [...buttons, ...links];
  const properSizedTargets = touchTargets.filter(target => {
    const rect = target.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44; // WCAG minimum
  });
  
  return {
    totalTargets: touchTargets.length,
    properSizedTargets: properSizedTargets.length,
    percentage: touchTargets.length ? (properSizedTargets.length / touchTargets.length) * 100 : 100
  };
};

// Test color contrast (requires additional setup)
export const testColorContrast = async (container: Element) => {
  const results = await caribbeanAxeConfig(container, {
    rules: {
      'color-contrast': { enabled: true },
      'color-contrast-enhanced': { enabled: true }
    }
  });
  
  return results.violations.filter(v => 
    v.id === 'color-contrast' || v.id === 'color-contrast-enhanced'
  );
};

// Caribbean-specific accessibility tests
export const caribbeanA11yTests = {
  // Test package scanning interface
  packageScanner: async (container: Element) => {
    const scanner = container.querySelector('[data-testid="barcode-scanner"], .barcode-scanner');
    if (!scanner) return { passed: true, message: 'No scanner found' };
    
    const hasLabel = scanner.getAttribute('aria-label') || 
                    scanner.querySelector('label');
    const hasInstructions = scanner.getAttribute('aria-describedby') ||
                           container.querySelector('.scanner-instructions');
    
    return {
      passed: !!hasLabel && !!hasInstructions,
      hasLabel: !!hasLabel,
      hasInstructions: !!hasInstructions,
      message: !hasLabel ? 'Scanner needs aria-label' : 
               !hasInstructions ? 'Scanner needs instructions' : 'Scanner is accessible'
    };
  },

  // Test customer forms
  customerForm: async (container: Element) => {
    const form = container.querySelector('form');
    if (!form) return { passed: true, message: 'No form found' };
    
    const inputs = form.querySelectorAll('input, textarea, select');
    const labelsCount = form.querySelectorAll('label').length;
    const inputsWithLabels = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const associatedLabel = id ? form.querySelector(`label[for="${id}"]`) : null;
      
      return ariaLabel || ariaLabelledBy || associatedLabel;
    });
    
    const hasSpanishLabels = Array.from(form.querySelectorAll('label')).some(label =>
      label.textContent?.includes('ñ') || 
      label.textContent?.includes('á') ||
      label.getAttribute('lang') === 'es'
    );
    
    return {
      passed: inputsWithLabels.length === inputs.length && hasSpanishLabels,
      totalInputs: inputs.length,
      labeledInputs: inputsWithLabels.length,
      hasSpanishLabels,
      message: inputsWithLabels.length !== inputs.length ? 'Some inputs lack labels' :
               !hasSpanishLabels ? 'Form needs Spanish labels' : 'Form is accessible'
    };
  },

  // Test data tables
  dataTable: async (container: Element) => {
    const table = container.querySelector('table');
    if (!table) return { passed: true, message: 'No table found' };
    
    const hasCaption = !!table.querySelector('caption');
    const hasHeaders = !!table.querySelector('th');
    const headersHaveScope = Array.from(table.querySelectorAll('th')).every(th =>
      th.getAttribute('scope') || th.getAttribute('id')
    );
    
    const hasSortingAnnouncement = Array.from(table.querySelectorAll('th[aria-sort]')).length > 0;
    
    return {
      passed: hasHeaders && headersHaveScope,
      hasCaption,
      hasHeaders,
      headersHaveScope,
      hasSortingAnnouncement,
      message: !hasHeaders ? 'Table needs headers' :
               !headersHaveScope ? 'Headers need scope attributes' : 'Table is accessible'
    };
  },

  // Test navigation
  navigation: async (container: Element) => {
    const nav = container.querySelector('nav, [role="navigation"]');
    if (!nav) return { passed: true, message: 'No navigation found' };
    
    const hasLabel = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
    const hasLandmark = nav.tagName === 'NAV' || nav.getAttribute('role') === 'navigation';
    const hasSkipLink = !!container.querySelector('.skip-link, a[href="#main-content"]');
    
    return {
      passed: hasLabel && hasLandmark,
      hasLabel: !!hasLabel,
      hasLandmark,
      hasSkipLink,
      message: !hasLabel ? 'Navigation needs aria-label' :
               !hasLandmark ? 'Navigation needs landmark role' : 'Navigation is accessible'
    };
  }
};

// Utility to run all Caribbean tests
export const runCaribbeanA11yTests = async (container: Element) => {
  const results = {
    axe: await testAccessibility(container),
    keyboard: testKeyboardNavigation(container),
    spanish: testSpanishAccessibility(container),
    mobile: testMobileAccessibility(container),
    contrast: await testColorContrast(container),
    caribbean: {
      packageScanner: await caribbeanA11yTests.packageScanner(container),
      customerForm: await caribbeanA11yTests.customerForm(container),
      dataTable: await caribbeanA11yTests.dataTable(container),
      navigation: await caribbeanA11yTests.navigation(container)
    }
  };
  
  return results;
};

export default {
  caribbeanAxeConfig,
  testAccessibility,
  testKeyboardNavigation,
  testSpanishAccessibility,
  testMobileAccessibility,
  testColorContrast,
  caribbeanA11yTests,
  runCaribbeanA11yTests
};
