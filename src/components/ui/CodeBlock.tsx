import React from 'react';
import { sanitizeCode } from '@/lib/sanitize';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * A safe code block component that properly escapes and highlights code
 * to prevent XSS attacks while maintaining syntax highlighting.
 */
export function CodeBlock({ code, language = 'plaintext', className = '' }: CodeBlockProps) {
  if (!code) return null;
  
  // The code is properly escaped in the sanitizeCode function
  const html = sanitizeCode(code, language);
  
  return (
    <div className={`relative ${className}`}>
      <pre className="text-sm overflow-x-auto">
        <code 
          dangerouslySetInnerHTML={{ __html: html }}
          // This is safe because we've properly escaped the HTML in sanitizeCode
          suppressHydrationWarning
        />
      </pre>
    </div>
  );
}
