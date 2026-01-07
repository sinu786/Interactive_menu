#!/usr/bin/env node

/**
 * GLB to USDZ Converter Script
 * 
 * This script converts GLB files to USDZ format for iOS Quick Look AR.
 * 
 * Requirements:
 * - macOS with Xcode Command Line Tools installed
 * - OR: Python with usd-core package (pip install usd-core)
 * - OR: Apple's Reality Converter app
 * 
 * Usage:
 *   node scripts/convert-to-usdz.js           # Convert all GLB files
 *   node scripts/convert-to-usdz.js --watch   # Watch for new files
 *   node scripts/convert-to-usdz.js <file>    # Convert specific file
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', 'Models');
const CONVERTED_LOG = path.join(MODELS_DIR, '.converted.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Check what conversion tools are available
function getAvailableConverter() {
  // Check for usdzconvert (comes with Xcode)
  try {
    execSync('which usdzconvert', { stdio: 'ignore' });
    return 'usdzconvert';
  } catch {}

  // Check for Reality Converter CLI
  const realityConverterPath = '/Applications/Reality Converter.app/Contents/MacOS/Reality Converter';
  if (fs.existsSync(realityConverterPath)) {
    return 'reality-converter';
  }

  // Check for Python USD tools
  try {
    execSync('python3 -c "import pxr"', { stdio: 'ignore' });
    return 'python-usd';
  } catch {}

  return null;
}

// Convert GLB to USDZ using available tool
async function convertToUSDZ(glbPath, usdzPath) {
  const converter = getAvailableConverter();
  
  if (!converter) {
    throw new Error('No USDZ converter found. Please install one of:\n' +
      '  1. Xcode Command Line Tools (includes usdzconvert)\n' +
      '  2. Reality Converter app from Apple\n' +
      '  3. Python USD: pip3 install usd-core');
  }

  log(`  Converting with ${converter}...`, 'dim');

  return new Promise((resolve, reject) => {
    let cmd;

    switch (converter) {
      case 'usdzconvert':
        cmd = `usdzconvert "${glbPath}" "${usdzPath}"`;
        break;
      
      case 'reality-converter':
        // Reality Converter doesn't have a great CLI, use AppleScript
        cmd = `osascript -e '
          tell application "Reality Converter"
            open POSIX file "${glbPath}"
            delay 2
            export front document to POSIX file "${usdzPath}"
            close front document
          end tell
        '`;
        break;
      
      case 'python-usd':
        // Use Python USD tools
        cmd = `python3 -c "
from pxr import Usd, UsdGeom, UsdUtils
import os
stage = Usd.Stage.Open('${glbPath}')
stage.Export('${usdzPath}')
"`;
        break;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Conversion failed: ${stderr || error.message}`));
      } else {
        resolve();
      }
    });
  });
}

// Load conversion log
function loadConvertedLog() {
  try {
    if (fs.existsSync(CONVERTED_LOG)) {
      return JSON.parse(fs.readFileSync(CONVERTED_LOG, 'utf8'));
    }
  } catch {}
  return {};
}

// Save conversion log
function saveConvertedLog(log) {
  fs.writeFileSync(CONVERTED_LOG, JSON.stringify(log, null, 2));
}

// Get all GLB files
function getGLBFiles() {
  if (!fs.existsSync(MODELS_DIR)) {
    log(`Models directory not found: ${MODELS_DIR}`, 'red');
    return [];
  }

  return fs.readdirSync(MODELS_DIR)
    .filter(f => f.toLowerCase().endsWith('.glb'))
    .map(f => ({
      name: f,
      glbPath: path.join(MODELS_DIR, f),
      usdzPath: path.join(MODELS_DIR, f.replace(/\.glb$/i, '.usdz')),
      usdzName: f.replace(/\.glb$/i, '.usdz')
    }));
}

// Check if conversion is needed
function needsConversion(file, convertedLog) {
  // If USDZ doesn't exist, needs conversion
  if (!fs.existsSync(file.usdzPath)) {
    return true;
  }

  // If GLB was modified after conversion, needs reconversion
  const glbStat = fs.statSync(file.glbPath);
  const lastConverted = convertedLog[file.name];
  
  if (!lastConverted || glbStat.mtimeMs > lastConverted.timestamp) {
    return true;
  }

  return false;
}

// Main conversion function
async function convertAll(specificFile = null) {
  log('\n🔄 GLB to USDZ Converter\n', 'cyan');

  const converter = getAvailableConverter();
  if (!converter) {
    log('❌ No USDZ converter found!', 'red');
    log('\nPlease install one of the following:', 'yellow');
    log('  1. Xcode Command Line Tools: xcode-select --install', 'dim');
    log('  2. Reality Converter: Download from Apple Developer', 'dim');
    log('  3. Python USD: pip3 install usd-core', 'dim');
    log('\nAlternatively, convert manually using Reality Converter app.\n', 'dim');
    process.exit(1);
  }

  log(`✓ Using converter: ${converter}\n`, 'green');

  let files = getGLBFiles();
  
  if (specificFile) {
    files = files.filter(f => f.name === specificFile || f.glbPath === specificFile);
    if (files.length === 0) {
      log(`File not found: ${specificFile}`, 'red');
      process.exit(1);
    }
  }

  if (files.length === 0) {
    log('No GLB files found in Models directory.', 'yellow');
    return;
  }

  const convertedLog = loadConvertedLog();
  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    if (!needsConversion(file, convertedLog)) {
      log(`⏭  ${file.name} → already converted`, 'dim');
      skipped++;
      continue;
    }

    log(`📦 ${file.name}`, 'cyan');

    try {
      await convertToUSDZ(file.glbPath, file.usdzPath);
      
      // Update log
      convertedLog[file.name] = {
        timestamp: Date.now(),
        usdzFile: file.usdzName
      };
      
      log(`  ✓ Created ${file.usdzName}`, 'green');
      converted++;
    } catch (err) {
      log(`  ✗ Failed: ${err.message}`, 'red');
      failed++;
    }
  }

  saveConvertedLog(convertedLog);

  log('\n' + '─'.repeat(40), 'dim');
  log(`✓ Converted: ${converted}`, 'green');
  log(`⏭ Skipped: ${skipped}`, 'dim');
  if (failed > 0) {
    log(`✗ Failed: ${failed}`, 'red');
  }
  log('');
}

// Watch mode
function watchMode() {
  log('\n👀 Watching for new GLB files...\n', 'cyan');
  
  fs.watch(MODELS_DIR, async (eventType, filename) => {
    if (filename && filename.toLowerCase().endsWith('.glb')) {
      log(`\nDetected change: ${filename}`, 'yellow');
      await convertAll(filename);
    }
  });

  // Initial conversion
  convertAll();
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else if (args.includes('--help') || args.includes('-h')) {
  log(`
GLB to USDZ Converter

Usage:
  node scripts/convert-to-usdz.js           Convert all GLB files
  node scripts/convert-to-usdz.js --watch   Watch for changes
  node scripts/convert-to-usdz.js <file>    Convert specific file
  node scripts/convert-to-usdz.js --help    Show this help

Requirements (one of):
  - Xcode Command Line Tools (includes usdzconvert)
  - Reality Converter app from Apple
  - Python USD: pip3 install usd-core
`);
} else if (args.length > 0 && !args[0].startsWith('-')) {
  convertAll(args[0]);
} else {
  convertAll();
}


