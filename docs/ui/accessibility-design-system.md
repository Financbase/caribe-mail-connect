# Accessibility Design System

*Last updated: 2025-08-13*

## Table of Contents
- [Tailwind Token Usage](#tailwind-token-usage)
- [Component Patterns](#component-patterns)
- [WCAG Compliance Checks](#wcag-compliance-checks)

## Tailwind Token Usage
Our design system relies on Tailwind tokens to maintain visual consistency across PRMCE ventures. Use semantic color tokens such as `bg-primary`, `text-secondary`, and spacing tokens like `p-4` or `m-2` to ensure themes can be updated centrally.

## Component Patterns
Components should follow responsive, accessible patterns:
- Use flex or grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2`) for responsive layouts.
- Include keyboard navigation with `tabIndex` and `aria` attributes for interactive elements.
- Wrap complex interactions in reusable components to support EcosystemVentures3D and other ventures.

## WCAG Compliance Checks
Before deploying, verify each component against WCAG 2.1 AA guidelines:
- Ensure a minimum contrast ratio of 4.5:1 for text.
- Validate semantic HTML structure and ARIA roles.
- Run automated accessibility tests with `axe-core` in CI to catch regressions.
