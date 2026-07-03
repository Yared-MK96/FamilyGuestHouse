const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const adminDir = path.join(rootDir, 'admin');
const distDir = path.join(rootDir, 'dist');

console.log('--- Starting Build Script ---');

try {
  // 1. Install admin dependencies
  console.log('Installing admin dependencies...');
  execSync('npm install', { cwd: adminDir, stdio: 'inherit' });

  // 2. Build admin app
  console.log('Building admin application...');
  execSync('npm run build', { cwd: adminDir, stdio: 'inherit' });

  // 3. Prepare clean dist directory
  console.log('Preparing dist directory...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir);

  // 4. Copy root files (public site) to dist/
  console.log('Copying public website files to dist...');
  const files = fs.readdirSync(rootDir);
  const excludeList = [
    'node_modules',
    'admin',
    'server',
    '.git',
    '.gitignore',
    'package.json',
    'package-lock.json',
    'build.js',
    'dist',
    'schema.sql'
  ];

  for (const file of files) {
    if (excludeList.includes(file)) continue;
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    const stat = fs.statSync(srcPath);

    if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else if (stat.isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    }
  }

  // 5. Copy compiled admin app to dist/admin
  console.log('Copying compiled admin app to dist/admin...');
  const adminDistDir = path.join(adminDir, 'dist');
  const destAdminDir = path.join(distDir, 'admin');
  
  if (fs.existsSync(adminDistDir)) {
    fs.cpSync(adminDistDir, destAdminDir, { recursive: true });
    console.log('Build completed successfully!');
  } else {
    throw new Error('Admin build output directory not found at: ' + adminDistDir);
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
