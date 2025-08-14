import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    a11y: {
      element: '#root',
      manual: false,
    },
    controls: { expanded: true },
    layout: 'centered',
  },
};

export default preview;
