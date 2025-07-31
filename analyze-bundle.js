import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function analyzeBundle() {
  try {
    console.log('🔍 Analyzing bundle size...');
    
    const result = await build({
      configFile: resolve(__dirname, 'vite.config.ts'),
      mode: 'production',
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'ui-components': [
                '@radix-ui/react-dialog', 
                '@radix-ui/react-dropdown-menu', 
                '@radix-ui/react-tabs'
              ],
              'charts-vendor': ['recharts', 'mermaid'],
              'supabase-client': ['@supabase/supabase-js'],
              'icons-utils': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']
            }
          }
        }
      }
    });

    console.log('✅ Bundle analysis complete!');
    console.log('📊 Bundle output:', result);
    
    // Analyze chunk sizes
    if (result.output) {
      console.log('\n📦 Chunk Analysis:');
      result.output.forEach(chunk => {
        if (chunk.type === 'chunk') {
          const sizeKB = (chunk.code.length / 1024).toFixed(2);
          console.log(`  ${chunk.fileName}: ${sizeKB} KB`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
  }
}

analyzeBundle(); 