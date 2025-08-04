import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createViteSecurityPlugin, DEFAULT_SECURITY_CONFIG, DEVELOPMENT_SECURITY_CONFIG } from './src/lib/security/security-headers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use React's automatic JSX runtime for smaller bundle
      jsxRuntime: 'automatic',
      // Enable fast refresh for better development experience
      fastRefresh: true,
    }),
    // Temporarily disable security plugin for development
    // createViteSecurityPlugin(
    //   process.env.NODE_ENV === 'development' 
    //     ? {
    //         ...DEVELOPMENT_SECURITY_CONFIG,
    //         csp: {
    //           ...DEVELOPMENT_SECURITY_CONFIG.csp!,
    //           reportUri: process.env.VITE_CSP_REPORT_URI || '/api/csp-report'
    //         },
    //         cors: {
    //           ...DEVELOPMENT_SECURITY_CONFIG.cors!,
    //           origin: process.env.VITE_ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || DEVELOPMENT_SECURITY_CONFIG.cors!.origin
    //         }
    //       }
    //     : {
    //         ...DEFAULT_SECURITY_CONFIG,
    //         csp: {
    //           ...DEFAULT_SECURITY_CONFIG.csp!,
    //           reportUri: process.env.VITE_CSP_REPORT_URI || '/api/csp-report'
    //         },
    //         cors: {
    //           ...DEFAULT_SECURITY_CONFIG.cors!,
    //           origin: process.env.VITE_ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || DEFAULT_SECURITY_CONFIG.cors!.origin
    //         }
    //       }
    // ),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Reduced to 5MB for faster loading
        // Optimize caching strategy
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PRMCMS - Package & Mail Management',
        short_name: 'PRMCMS',
        description: 'Comprehensive package and mail management system',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],

          // UI component libraries
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot'
          ],

          // Chart and visualization libraries
          'charts-vendor': ['recharts', 'mermaid'],

          // Backend and data libraries
          'supabase-client': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],

          // Form handling libraries
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Utility libraries
          'icons-utils': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'date-vendor': ['date-fns'],

          // Router and navigation
          'router-vendor': ['react-router-dom']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'date-fns',
      '@radix-ui/react-toast',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-separator',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-tabs',
      '@radix-ui/react-slot',
    ],
    exclude: ['@vite/client', '@vite/env', 'lovable-tagger'],
    force: true,
    esbuildOptions: {
      target: 'es2020',
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    hmr: {
      overlay: false,
      port: 3001,
    },
    fs: {
      allow: ['..']
    },
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
  css: {
    devSourcemap: false,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})