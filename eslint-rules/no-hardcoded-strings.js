// ESLint rule to prevent hardcoded strings in UI components
// Enforces use of translation keys for Caribbean Mail System

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce translation keys instead of hardcoded strings',
      category: 'Internationalization',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowedStrings: {
            type: 'array',
            items: { type: 'string' }
          },
          allowedPatterns: {
            type: 'array',
            items: { type: 'string' }
          },
          excludeFiles: {
            type: 'array',
            items: { type: 'string' }
          },
          translationFunction: {
            type: 'string',
            default: 't'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      hardcodedString: 'Hardcoded string "{{string}}" should use translation key. Use {{func}}("key", "{{string}}") instead.',
      missingFallback: 'Translation function call missing fallback for "{{key}}".',
      invalidKey: 'Translation key "{{key}}" should be descriptive and follow naming convention.'
    }
  },

  create(context) {
    const options = context.getOptions()[0] || {};
    const allowedStrings = options.allowedStrings || [
      '', ' ', '\n', '\t', // Empty/whitespace strings
      '/', '#', '?', '&', '=', // URL parts
      'px', 'rem', 'em', '%', 'vh', 'vw', // CSS units
      'true', 'false', 'null', 'undefined', // Literals
      'utf-8', 'en', 'es', 'es-PR', // Standard values
      'GET', 'POST', 'PUT', 'DELETE', 'PATCH', // HTTP methods
      'application/json', 'text/html', // MIME types
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' // Single digits
    ];
    
    const allowedPatterns = options.allowedPatterns || [
      '^[A-Z_]+$', // Constants
      '^\\d+$', // Numbers
      '^[a-z-]+$', // CSS classes/IDs (when short)
      '^\\$\\{.*\\}$', // Template literals
      '^#[0-9a-fA-F]{3,6}$', // Hex colors
      '^rgba?\\(.*\\)$', // CSS colors
      '^url\\(.*\\)$', // CSS URLs
      '^data:.*$', // Data URLs
      '^https?://.*$', // URLs
      '^/.*$', // Paths
      '^\\w+://.*$' // Protocols
    ];

    const excludeFiles = options.excludeFiles || [
      'test', 'spec', 'stories', 'config', 'types',
      '.d.ts', '.test.', '.spec.', '.stories.'
    ];

    const translationFunction = options.translationFunction || 't';

    // Check if file should be excluded
    const filename = context.getFilename();
    const shouldExclude = excludeFiles.some(pattern => 
      filename.includes(pattern) || filename.endsWith(pattern)
    );

    if (shouldExclude) {
      return {};
    }

    // Helper functions
    function isAllowedString(str) {
      if (allowedStrings.includes(str)) return true;
      return allowedPatterns.some(pattern => new RegExp(pattern).test(str));
    }

    function isInJSXText(node) {
      return node.parent && node.parent.type === 'JSXText';
    }

    function isInJSXAttribute(node) {
      return node.parent && node.parent.type === 'JSXExpressionContainer' &&
             node.parent.parent && node.parent.parent.type === 'JSXAttribute';
    }

    function isTranslationFunctionCall(node) {
      return node.parent && 
             node.parent.type === 'CallExpression' &&
             node.parent.callee &&
             node.parent.callee.name === translationFunction;
    }

    function isValidTranslationKey(key) {
      // Translation keys should be descriptive and follow naming convention
      return /^[a-z][a-z0-9_]*[a-z0-9]$/.test(key) && key.length >= 3;
    }

    function generateTranslationKey(string) {
      // Generate a suggested translation key from the string
      return string
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .slice(0, 3) // Take first 3 words
        .join('_');
    }

    function createFix(node, string) {
      const key = generateTranslationKey(string);
      const replacement = `${translationFunction}("${key}", "${string}")`;
      
      return function(fixer) {
        return fixer.replaceText(node, replacement);
      };
    }

    return {
      Literal(node) {
        // Only check string literals
        if (typeof node.value !== 'string') return;

        const string = node.value;
        
        // Skip if string is allowed
        if (isAllowedString(string)) return;

        // Skip if already in translation function
        if (isTranslationFunctionCall(node)) return;

        // Skip if not in UI context (JSX)
        if (!isInJSXText(node) && !isInJSXAttribute(node)) return;

        // Skip very short strings (likely not user-facing)
        if (string.length < 2) return;

        context.report({
          node,
          messageId: 'hardcodedString',
          data: {
            string: string.substring(0, 50) + (string.length > 50 ? '...' : ''),
            func: translationFunction
          },
          fix: createFix(node, string)
        });
      },

      TemplateLiteral(node) {
        // Check template literals for hardcoded text
        node.quasis.forEach(quasi => {
          const string = quasi.value.cooked;
          if (!string || isAllowedString(string)) return;

          // Skip if not in UI context
          if (!isInJSXText(node) && !isInJSXAttribute(node)) return;

          context.report({
            node: quasi,
            messageId: 'hardcodedString',
            data: {
              string: string.substring(0, 50) + (string.length > 50 ? '...' : ''),
              func: translationFunction
            }
          });
        });
      },

      CallExpression(node) {
        // Check translation function calls for proper usage
        if (node.callee.name !== translationFunction) return;

        const args = node.arguments;
        
        // Translation function should have at least key argument
        if (args.length === 0) return;

        const keyArg = args[0];
        const fallbackArg = args[1];

        // Check if key is a literal string
        if (keyArg.type === 'Literal' && typeof keyArg.value === 'string') {
          const key = keyArg.value;
          
          // Validate key format
          if (!isValidTranslationKey(key)) {
            context.report({
              node: keyArg,
              messageId: 'invalidKey',
              data: { key }
            });
          }

          // Check for fallback (recommended for development)
          if (!fallbackArg && args.length === 1) {
            context.report({
              node,
              messageId: 'missingFallback',
              data: { key }
            });
          }
        }
      },

      JSXText(node) {
        const text = node.value.trim();
        if (!text || isAllowedString(text)) return;

        // Skip whitespace-only text
        if (/^\s*$/.test(node.value)) return;

        context.report({
          node,
          messageId: 'hardcodedString',
          data: {
            string: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            func: translationFunction
          },
          fix: function(fixer) {
            const key = generateTranslationKey(text);
            const replacement = `{${translationFunction}("${key}", "${text}")}`;
            return fixer.replaceText(node, replacement);
          }
        });
      }
    };
  }
};

// Caribbean-specific translation rules
module.exports.caribbeanConfig = {
  allowedStrings: [
    // Common technical terms
    'API', 'URL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'CSV',
    'UUID', 'ID', 'QR', 'PDF', 'PNG', 'JPG', 'JPEG',
    
    // Caribbean/Puerto Rico specific
    'PR', 'USA', 'USPS', 'UPS', 'FedEx', 'DHL',
    'San Juan', 'Bayamón', 'Carolina', 'Ponce',
    
    // Common abbreviations
    'etc', 'e.g.', 'i.e.', 'vs', 'kg', 'lb', 'oz',
    
    // Bootstrap/CSS classes (short ones)
    'btn', 'nav', 'card', 'form', 'row', 'col',
    
    // Common symbols
    '•', '→', '←', '↑', '↓', '✓', '✗', '⚠', '⚡',
    '📦', '📧', '📱', '🔍', '🏠', '🏢', '🚚',
    
    // Time/date formats
    'AM', 'PM', 'GMT', 'UTC', 'EST', 'AST',
    
    // Currency
    '$', '€', '£', 'USD', 'EUR'
  ],

  allowedPatterns: [
    // Version numbers
    '^v?\\d+\\.\\d+\\.\\d+$',
    
    // Puerto Rico postal codes
    '^\\d{5}(-\\d{4})?$',
    
    // Phone numbers
    '^\\+?1?[\\s\\-\\.]?\\(?[2-9]\\d{2}\\)?[\\s\\-\\.]?\\d{3}[\\s\\-\\.]?\\d{4}$',
    
    // Email patterns
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    
    // CSS custom properties
    '^--[a-z][a-z0-9-]*$',
    
    // Test IDs
    '^data-testid$',
    '^test-.*$',
    
    // Tracking numbers
    '^[A-Z]{2}\\d{9}[A-Z]{2}$',
    '^\\d{12}$',
    '^1Z[A-Z0-9]{16}$'
  ],

  // Files to exclude from translation enforcement
  excludeFiles: [
    'test', 'spec', 'stories', 'config', 'types', 'utils', 'constants',
    '.test.', '.spec.', '.stories.', '.config.', '.d.ts',
    'vite.config', 'tailwind.config', 'eslint.config',
    'jest.config', 'playwright.config'
  ]
};
