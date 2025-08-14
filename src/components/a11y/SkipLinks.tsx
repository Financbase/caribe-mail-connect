import React from 'react'

export function SkipLinks() {
  return (
    <div aria-hidden="false">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#primary-navigation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-12 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
      >
        Saltar a la navegación
      </a>
    </div>
  )
}

export default SkipLinks


