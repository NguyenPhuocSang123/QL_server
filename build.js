#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Starting build process...');

try {
  console.log('📦 Installing backend dependencies...');
  execSync('npm install --prefix backend', { stdio: 'inherit' });

  console.log('📦 Installing frontend dependencies...');
  execSync('npm install --prefix frontend', { stdio: 'inherit' });

  console.log('🏗️ Building frontend...');
  execSync('npm run build --prefix frontend', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
