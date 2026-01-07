#!/usr/bin/env node

/**
 * GLB to USDZ Converter Script
 * 
 * This script converts GLB files to USDZ format for iOS Quick Look AR.
 * 
 * Requirements (one of):
 * - macOS: Download "Reality Converter" from Apple Developer (free)
 *   https://developer.apple.com/augmented-reality/tools/
 * - Python: pip3 install usd-core trimesh
 * - Xcode with usdzconvert (part of Reality Composer)
 * 
 * Usage:
 *   npm run convert:usdz           # Convert all GLB files
 *   npm run convert:usdz <file>    # Convert specific file
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
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  blue: '\x1b[34m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Check what conversion tools are available
function getAvailableConverter() {
  // 1. Check for usdzconvert (Xcode or Reality Composer)
  try {
    execSync('which usdzconvert', { stdio: 'ignore' });
    return { name: 'usdzconvert', cmd: 'usdzconvert' };
  } catch {}

  // 2. Check via xcrun
  try {
    execSync('xcrun --find usdzconvert', { stdio: 'ignore' });
    return { name: 'xcrun usdzconvert', cmd: 'xcrun usdzconvert' };
  } catch {}

  // 3. Check for Reality Converter app 
  const realityConverterPath = '/Applications/Reality Converter.app';
  if (fs.existsSync(realityConverterPath)) {
    return { name: 'Reality Converter', cmd: 'reality-converter' };
  }

  // 4. Check for Python USD tools
  try {
    execSync('python3 -c "from pxr import Usd, UsdGeom"', { stdio: 'ignore' });
    return { name: 'Python USD', cmd: 'python-usd' };
  } catch {}

  // 5. Check for trimesh (alternative Python approach)
  try {
    execSync('python3 -c "import trimesh"', { stdio: 'ignore' });
    return { name: 'Python trimesh', cmd: 'python-trimesh' };
  } catch {}

  return null;
}

// Convert a single file
async function convertFile(glbPath, usdzPath, converter) {
  return new Promise((resolve, reject) => {
    let cmd;

    switch (converter.cmd) {
      case 'usdzconvert':
      case 'xcrun usdzconvert':
        cmd = `${converter.cmd} "${glbPath}" "${usdzPath}"`;
        break;
      
      case 'reality-converter':
        // Reality Converter via AppleScript
        cmd = `osascript << 'EOF'
tell application "Reality Converter"
  activate
  open POSIX file "${glbPath}"
  delay 3
  tell application "System Events"
    tell process "Reality Converter"
      keystroke "e" using {command down, shift down}
      delay 1
      keystroke "g" using {command down, shift down}
      delay 0.5
      keystroke "${path.dirname(usdzPath)}"
      keystroke return
      delay 0.5
      keystroke "${path.basename(usdzPath)}"
      delay 0.5
      click button "Export" of sheet 1 of window 1
      delay 2
      keystroke "w" using command down
    end tell
  end tell
end tell
EOF`;
        break;
      
      case 'python-usd':
        const pythonScript = `
import sys
from pxr import Usd, UsdGeom, UsdUtils
stage = Usd.Stage.Open('${glbPath}')
UsdUtils.CreateNewARKitUsdzPackage('${glbPath}', '${usdzPath}')
`;
        cmd = `python3 -c "${pythonScript}"`;
        break;
      
      case 'python-trimesh':
        const trimeshScript = `
import trimesh
mesh = trimesh.load('${glbPath}')
mesh.export('${usdzPath}', file_type='usdz')
`;
        cmd = `python3 -c "${trimeshScript}"`;
        break;
      
      default:
        reject(new Error(`Unknown converter: ${converter.cmd}`));
        return;
    }

    exec(cmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve();
      }
    });
  });
}

// Load/save conversion log
function loadConvertedLog() {
  try {
    if (fs.existsSync(CONVERTED_LOG)) {
      return JSON.parse(fs.readFileSync(CONVERTED_LOG, 'utf8'));
    }
  } catch {}
  return {};
}

function saveConvertedLog(log) {
  fs.writeFileSync(CONVERTED_LOG, JSON.stringify(log, null, 2));
}

// Get all GLB files
function getGLBFiles() {
  if (!fs.existsSync(MODELS_DIR)) {
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

// Show installation instructions
function showInstallInstructions() {
  log('\n' + '═'.repeat(60), 'cyan');
  log('  📦 How to Install USDZ Converter', 'bold');
  log('═'.repeat(60), 'cyan');
  
  log('\n  Choose one of these options:\n', 'yellow');
  
  log('  Option 1: Reality Converter (Recommended, macOS)', 'bold');
  log('  ─────────────────────────────────────────────────', 'dim');
  log('  1. Go to: https://developer.apple.com/augmented-reality/tools/', 'dim');
  log('  2. Download "Reality Converter"', 'dim');
  log('  3. Move to /Applications', 'dim');
  log('  4. Run this script again\n', 'dim');

  log('  Option 2: Manual Conversion (Easiest)', 'bold');
  log('  ──────────────────────────────────────', 'dim');
  log('  1. Open Reality Converter app', 'dim');
  log('  2. Drag each .glb file into the app', 'dim');
  log('  3. Export as .usdz to the Models folder', 'dim');
  log('  4. The app will auto-detect the .usdz files\n', 'dim');

  log('  Option 3: Python USD (Advanced)', 'bold');
  log('  ────────────────────────────────', 'dim');
  log('  Run: pip3 install usd-core', 'dim');
  log('  Then run this script again\n', 'dim');
  
  log('  Option 4: Online Converter', 'bold');
  log('  ──────────────────────────', 'dim');
  log('  Use https://www.creators3d.com/online-converter', 'dim');
  log('  Convert GLB → USDZ and download to Models/\n', 'dim');

  log('═'.repeat(60) + '\n', 'cyan');
}

// Check for existing USDZ files
function checkExistingUSDZ() {
  const files = getGLBFiles();
  const existing = [];
  const missing = [];
  
  for (const file of files) {
    if (fs.existsSync(file.usdzPath)) {
      existing.push(file.usdzName);
    } else {
      missing.push(file.name);
    }
  }
  
  return { existing, missing };
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  log('\n🔄 GLB → USDZ Converter for iOS AR Quick Look\n', 'cyan');
  
  // Check for existing files
  const { existing, missing } = checkExistingUSDZ();
  
  if (existing.length > 0) {
    log(`✓ Found ${existing.length} existing USDZ file(s)`, 'green');
  }
  
  if (missing.length === 0) {
    log('✓ All models have USDZ versions - iOS AR ready!\n', 'green');
    return;
  }
  
  log(`⚠ ${missing.length} GLB file(s) need conversion:`, 'yellow');
  missing.forEach(f => log(`  • ${f}`, 'dim'));
  log('');
  
  // Check for converter
  const converter = getAvailableConverter();
  
  if (!converter) {
    log('❌ No USDZ converter found', 'red');
    showInstallInstructions();
    
    log('💡 The app will still work without USDZ files:', 'blue');
    log('   • iOS: 3D viewing works, but AR Quick Look disabled', 'dim');
    log('   • Android: Full Scene Viewer AR works with GLB', 'dim');
    log('   • Desktop: Full 3D viewing works\n', 'dim');
    
    process.exit(0); // Don't fail the build
  }
  
  log(`✓ Using converter: ${converter.name}\n`, 'green');
  
  const convertedLog = loadConvertedLog();
  let converted = 0;
  let failed = 0;
  
  for (const file of getGLBFiles()) {
    if (fs.existsSync(file.usdzPath)) {
      continue; // Already exists
    }
    
    log(`📦 Converting ${file.name}...`, 'cyan');
    
    try {
      await convertFile(file.glbPath, file.usdzPath, converter);
      
      // Verify file was created
      if (fs.existsSync(file.usdzPath)) {
        convertedLog[file.name] = {
          timestamp: Date.now(),
          usdzFile: file.usdzName,
          converter: converter.name
        };
        log(`  ✓ Created ${file.usdzName}`, 'green');
        converted++;
      } else {
        throw new Error('Output file not created');
      }
    } catch (err) {
      log(`  ✗ Failed: ${err.message}`, 'red');
      failed++;
    }
  }
  
  saveConvertedLog(convertedLog);
  
  log('\n' + '─'.repeat(40), 'dim');
  if (converted > 0) {
    log(`✓ Converted: ${converted} file(s)`, 'green');
  }
  if (failed > 0) {
    log(`✗ Failed: ${failed} file(s)`, 'red');
  }
  log('');
}

main().catch(err => {
  log(`Error: ${err.message}`, 'red');
  process.exit(0); // Don't fail the build
});
