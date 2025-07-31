import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TYPES_DIR = path.join(__dirname, '../../types/deno_std');
const DENO_STD_VERSION = '0.220.1';

// Create types directory if it doesn't exist
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Download Deno standard library types
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('Downloading Deno standard library types...');
    
    // Download the type definitions
    await downloadFile(
      `https://deno.land/std@${DENO_STD_VERSION}/http/server.ts`, 
      path.join(TYPES_DIR, 'http_server.d.ts')
    );
    
    // Create an index.d.ts file to re-export the types
    fs.writeFileSync(
      path.join(TYPES_DIR, 'index.d.ts'),
      `// Generated type definitions for Deno standard library
declare module '@std/http/server' {
  export * from './http_server';
}`
    );
    
    console.log('Successfully installed Deno standard library types');
  } catch (error) {
    console.error('Error installing Deno types:', error);
    process.exit(1);
  }
}

main();
