import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ac8297d17da14672b42f263b1dc5dd96',
  appName: 'caribe-mail-connect',
  webDir: 'dist',
  server: {
    url: 'https://ac8297d1-7da1-4672-b42f-263b1dc5dd96.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Haptics: {},
    Device: {},
    Network: {}
  }
};

export default config;