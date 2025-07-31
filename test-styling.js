import http from 'http';

// Test development server
const devReq = http.request('http://localhost:5173', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Development Server (Port 5173):');
    console.log('Has Tailwind classes:', data.includes('class='));
    console.log('Has shadcn classes:', data.includes('bg-background') || data.includes('text-foreground'));
    console.log('Sample classes found:', data.match(/class="[^"]*"/g)?.slice(0, 3) || 'None found');
    console.log('---');
  });
});

devReq.on('error', (err) => {
  console.log('Development server not accessible:', err.message);
});

devReq.end();

// Test production preview server
setTimeout(() => {
  const prodReq = http.request('http://localhost:4173', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Production Preview Server (Port 4173):');
      console.log('Has Tailwind classes:', data.includes('class='));
      console.log('Has shadcn classes:', data.includes('bg-background') || data.includes('text-foreground'));
      console.log('Sample classes found:', data.match(/class="[^"]*"/g)?.slice(0, 3) || 'None found');
    });
  });

  prodReq.on('error', (err) => {
    console.log('Production preview server not accessible:', err.message);
  });

  prodReq.end();
}, 1000); 