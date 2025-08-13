import { render } from '@testing-library/react';
import AccessibleLayout from './AccessibleLayout';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';

describe('AccessibleLayout', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AccessibleLayout />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
