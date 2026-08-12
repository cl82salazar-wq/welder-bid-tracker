/**
 * Cheap CI syntax check for Expo/React Native JS.
 * CJS files: `node --check`. App sources (ESM + JSX): Babel parse.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.expo',
  'dist',
  'web-build',
]);

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, acc);
    } else if (ent.name.endsWith('.js')) {
      acc.push(full);
    }
  }
  return acc;
}

function relPath(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function isCjs(rel) {
  return rel === 'babel.config.js' || rel.startsWith('scripts/');
}

function checkCjs(file) {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || 'node --check failed').trim();
    throw new Error(err);
  }
}

function checkAppSource(file, src) {
  let babel;
  try {
    babel = require('@babel/core');
  } catch (e) {
    throw new Error(
      'Missing @babel/core. Run npm ci before npm run ci:check. ' + e.message
    );
  }

  babel.parseSync(src, {
    sourceType: 'module',
    filename: file,
    parserOpts: {
      plugins: ['jsx'],
    },
  });
}

const files = walk(ROOT).sort((a, b) => relPath(a).localeCompare(relPath(b)));
if (files.length === 0) {
  console.error('No JavaScript files found');
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const rel = relPath(file);
  try {
    if (isCjs(rel)) {
      checkCjs(file);
    } else {
      checkAppSource(file, fs.readFileSync(file, 'utf8'));
    }
    console.log(`ok   ${rel}`);
  } catch (e) {
    failed += 1;
    console.error(`FAIL ${rel}`);
    console.error(e.message || e);
  }
}

if (failed) {
  console.error(`\n${failed} file(s) failed syntax check`);
  process.exit(1);
}

console.log(`\nChecked ${files.length} JavaScript file(s)`);
