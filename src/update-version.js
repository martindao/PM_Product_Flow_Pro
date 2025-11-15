#!/usr/bin/env node

/**
 * Version Update Helper
 * 
 * This script helps with updating the package version.
 * It updates package.json with the new version and creates an appropriate commit.
 * 
 * Usage: node update-version.js <major|minor|patch>
 * 
 * Examples:
 *   node update-version.js patch  # 1.0.0 -> 1.0.1
 *   node update-version.js minor  # 1.0.0 -> 1.1.0
 *   node update-version.js major  # 1.0.0 -> 2.0.0
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Read command-line arguments
const versionType = process.argv[2];
if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('Error: Version type must be one of: major, minor, patch');
  console.log('Usage: node update-version.js <major|minor|patch>');
  process.exit(1);
}

// Get current version from package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Parse version components
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
if (versionType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (versionType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else if (versionType === 'patch') {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Updated version from ${currentVersion} to ${newVersion}`);

// Run npm commands
try {
  // Build the package with the new version
  console.log('\nBuilding package...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create a git commit
  console.log('\nCommitting version update...');
  execSync('git add package.json', { stdio: 'inherit' });
  execSync(`git commit -m "Bump version to ${newVersion}"`, { stdio: 'inherit' });
  
  // Create a git tag
  console.log('\nCreating git tag...');
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  
  console.log(`\n✅ Version updated to ${newVersion}`);
  console.log('\nTo publish this version, run:');
  console.log('  git push && git push --tags');
  console.log('  npm publish');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} 