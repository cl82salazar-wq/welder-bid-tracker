/**
 * Expo SDK 49 + Node 22+/24 on Windows: module.builtinModules may include
 * names like "node:sea". Creating ".expo/metro/externals/node:sea" fails
 * because ":" is illegal in Windows paths. Strip node: prefixes and skip
 * any remaining colon-bearing ids before Metro bootstraps shims.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'start',
  'server',
  'metro',
  'externals.js'
);

if (!fs.existsSync(target)) {
  console.log('[patch-expo-windows] @expo/cli externals.js not found; skip');
  process.exit(0);
}

let src = fs.readFileSync(target, 'utf8');
const marker = '/* patched-for-windows-node-builtins */';
if (src.includes(marker)) {
  console.log('[patch-expo-windows] already applied');
  process.exit(0);
}

const needle = `const NODE_STDLIB_MODULES = [
    "fs/promises",
    ...(_module.builtinModules || // @ts-expect-error
    (process.binding ? Object.keys(process.binding("natives")) : []) || []).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![
            "sys"
        ].includes(x)
    ), 
].sort();`;

const replacement = `const NODE_STDLIB_MODULES = [
    "fs/promises",
    ...(_module.builtinModules || // @ts-expect-error
    (process.binding ? Object.keys(process.binding("natives")) : []) || []).map((x)=>String(x).replace(/^node:/, "")).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && !x.includes(":") && ![
            "sys"
        ].includes(x)
    ), ${marker}
].sort();`;

if (!src.includes('builtinModules')) {
  console.warn('[patch-expo-windows] unexpected externals.js shape; skip');
  process.exit(0);
}

if (src.includes(needle)) {
  src = src.replace(needle, replacement);
} else {
  // Fallback: inject map/filter hardening next to builtinModules usage
  src = src.replace(
    '...(_module.builtinModules ||',
    '...(_module.builtinModules ||'
  );
  src = src.replace(
    ']).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![',
    ']).map((x)=>String(x).replace(/^node:/, "")).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && !x.includes(":") && !['
  );
  if (!src.includes('!x.includes(":")')) {
    console.warn('[patch-expo-windows] could not apply patch; skip');
    process.exit(0);
  }
  src = src.replace(
    '    ), \n].sort();',
    `    ), ${marker}\n].sort();`
  );
}

fs.writeFileSync(target, src);
console.log('[patch-expo-windows] patched', target);
