#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if required tools are installed
function checkDependencies() {
  try {
    execSync('which npm', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ npm is required but not installed');
    return false;
  }
}

// Install dependencies if needed
function installDependencies() {
  const packageJson = {
    "name": "quietloudlab-build",
    "version": "1.0.0",
    "description": "Build tools for quietloudlab website",
    "scripts": {
      "build": "node build.js"
    },
    "devDependencies": {
      "clean-css-cli": "^5.6.0",
      "terser": "^5.19.0",
      "html-minifier": "^4.0.0"
    }
  };

  if (!fs.existsSync('package.json')) {
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('📦 Created package.json');
  }

  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
}

// Minify CSS
function minifyCSS() {
  console.log('🎨 Minifying CSS...');
  try {
    const input = 'style.css';
    const output = 'style.min.css';
    execSync(`npx clean-css-cli ${input} -o ${output}`, { stdio: 'inherit' });
    
    // Update HTML to use minified CSS
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace('style.css', 'style.min.css');
    fs.writeFileSync('index.html', html);
    
    console.log('✅ CSS minified successfully');
  } catch (error) {
    console.error('❌ CSS minification failed:', error.message);
  }
}

// Minify JavaScript
function minifyJS() {
  console.log('⚡ Minifying JavaScript...');
  try {
    const input = 'script.js';
    const output = 'script.min.js';
    execSync(`npx terser ${input} -o ${output} --compress --mangle`, { stdio: 'inherit' });
    
    // Update HTML to use minified JS
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace('script.js', 'script.min.js');
    fs.writeFileSync('index.html', html);
    
    console.log('✅ JavaScript minified successfully');
  } catch (error) {
    console.error('❌ JavaScript minification failed:', error.message);
  }
}

// Minify HTML
function minifyHTML() {
  console.log('📄 Minifying HTML...');
  try {
    const input = 'index.html';
    const output = 'index.min.html';
    execSync(`npx html-minifier ${input} -o ${output} --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true`, { stdio: 'inherit' });
    
    // Replace original with minified version
    fs.copyFileSync(output, input);
    fs.unlinkSync(output);
    
    console.log('✅ HTML minified successfully');
  } catch (error) {
    console.error('❌ HTML minification failed:', error.message);
  }
}

// Create production directory
function createProductionDir() {
  const prodDir = 'dist';
  if (!fs.existsSync(prodDir)) {
    fs.mkdirSync(prodDir);
  }
  
  // Copy all files to dist
  const files = [
    'index.html',
    'style.min.css',
    'script.min.js',
    'site.webmanifest',
    'robots.txt',
    'sitemap.xml'
    // Note: .htaccess is excluded for GitHub Pages deployment
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(prodDir, file));
    }
  });
  
  // Copy directories
  const dirs = ['assets', 'fonts'];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      execSync(`cp -r ${dir} ${prodDir}/`, { stdio: 'inherit' });
    }
  });
  
  console.log('📁 Production files created in dist/ directory');
}

// Main build function
function build() {
  console.log('🚀 Starting production build...\n');
  
  if (!checkDependencies()) {
    process.exit(1);
  }
  
  installDependencies();
  minifyCSS();
  minifyJS();
  minifyHTML();
  createProductionDir();
  
  console.log('\n🎉 Production build completed successfully!');
  console.log('📁 Your optimized files are in the dist/ directory');
  console.log('🌐 Ready for deployment to your web server');
}

// Run build
build(); 