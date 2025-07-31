import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup-templating';

const window = new JSDOM('').window;
const domPurify = DOMPurify(window as unknown as Window);

// Configure DOMPurify to be more restrictive by default
const baseConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'link'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout'],
  USE_PROFILES: { html: false, svg: true, svgFilters: true, mathMl: false }
};

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return domPurify.sanitize(html, {
    ...baseConfig,
    ALLOWED_TAGS: ['pre', 'code', 'span', 'div', 'br', 'p', 'b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel'],
    ADD_ATTR: ['target', 'rel']
  });
}

// Map language names to Prism language identifiers
const languageMap: Record<string, string> = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  php: 'php',
  java: 'java',
  csharp: 'csharp',
  cs: 'csharp',
  go: 'go',
  ruby: 'ruby',
  rb: 'ruby',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  html: 'html',
  xml: 'xml',
  curl: 'bash',
  http: 'http'
};

// Format and highlight code using Prism
function formatCode(code: string, language: string = 'plaintext'): string {
  if (!code) return '';
  
  // Get the Prism language or default to plaintext
  const prismLang = languageMap[language.toLowerCase()] || 'plaintext';
  
  try {
    // Try to highlight the code with the specified language
    if (Prism.languages[prismLang]) {
      return Prism.highlight(code, Prism.languages[prismLang], prismLang);
    }
    
    // Fall back to plaintext highlighting
    return Prism.highlight(code, Prism.languages.plaintext, 'plaintext');
  } catch (error) {
    console.error('Error highlighting code:', error);
    // Return the code as plain text if highlighting fails
    return domPurify.sanitize(code, {
      ...baseConfig,
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class']
    });
  }
}

export function sanitizeCode(code: string, language: string = 'plaintext'): string {
  if (!code) return '';
  
  // First, escape any HTML entities to prevent XSS
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
    
  // Then apply syntax highlighting
  return formatCode(escaped, language);
}
