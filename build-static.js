#!/usr/bin/env node

// Build script for static deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building static site for deployment...');

try {
  // Run Vite build
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create _redirects file for SPA routing
  const redirectsContent = '/*    /index.html   200\n';
  fs.writeFileSync(path.join('dist', 'public', '_redirects'), redirectsContent);
  
  console.log('✅ Static build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}