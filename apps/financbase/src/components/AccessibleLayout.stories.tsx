import type { Meta, StoryObj } from '@storybook/react';
import AccessibleLayout from './AccessibleLayout';

const meta: Meta<typeof AccessibleLayout> = {
  title: 'Financbase/AccessibleLayout',
  component: AccessibleLayout,
};

export default meta;

type Story = StoryObj<typeof AccessibleLayout>;

export const Responsive: Story = {
  render: () => <AccessibleLayout />,
};
