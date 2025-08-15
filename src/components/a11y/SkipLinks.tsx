import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface SkipLink {
  href: string;
  labelEn: string;
  labelEs: string;
}

interface SkipLinksProps {
  className?: string;
  links?: SkipLink[];
}

/**
 * Enhanced skip links component for WCAG 2.1 AA compliance
 * Provides keyboard navigation shortcuts for screen readers
 * Bilingual support for Puerto Rico Spanish users
 */
export function SkipLinks({ className, links }: SkipLinksProps) {
  const { language } = useLanguage();
  
  const defaultLinks: SkipLink[] = [
    {
      href: '#main-content',
      labelEn: 'Skip to main content',
      labelEs: 'Saltar al contenido principal',
    },
    {
      href: '#primary-navigation',
      labelEn: 'Skip to navigation',
      labelEs: 'Saltar a la navegación',
    },
    {
      href: '#package-scanner',
      labelEn: 'Skip to package scanner',
      labelEs: 'Saltar al escáner de paquetes',
    },
    {
      href: '#customer-search',
      labelEn: 'Skip to customer search',
      labelEs: 'Saltar a búsqueda de clientes',
    },
    {
      href: '#quick-actions',
      labelEn: 'Skip to quick actions',
      labelEs: 'Saltar a acciones rápidas',
    },
  ];

  const skipLinks = links || defaultLinks;

  return (
    <div className={cn('skip-links', className)} aria-hidden="false">
      {skipLinks.map((link, index) => (
        <a
          key={`${link.href}-${index}`}
          href={link.href}
          className={cn(
            // Initially hidden, visible on focus
            'sr-only focus:not-sr-only',
            'focus:fixed focus:z-50',
            `focus:top-${2 + index * 10} focus:left-2`,
            
            // Visual styling with Caribbean theme
            'focus:bg-[#0B5394] focus:text-white',
            'focus:px-4 focus:py-2 focus:rounded-md',
            'focus:shadow-lg focus:border focus:border-[#FF6B35]/20',
            
            // Focus ring for accessibility
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'focus:ring-[#FF6B35] focus:ring-offset-white',
            
            // Mobile optimization
            'focus:text-base focus:font-medium',
            'focus:min-w-[200px] focus:text-center',
            
            // Animation
            'transition-all duration-200 ease-in-out'
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const target = document.querySelector(link.href);
              if (target instanceof HTMLElement) {
                target.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start' 
                });
                
                // Focus the target element
                if (target.tabIndex === -1) {
                  target.tabIndex = -1;
                }
                target.focus();
              }
            }
          }}
        >
          {language === 'es' ? link.labelEs : link.labelEn}
        </a>
      ))}
    </div>
  );
}

export default SkipLinks


