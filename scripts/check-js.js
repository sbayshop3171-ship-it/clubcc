const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoreDirs = new Set(['.git', 'node_modules']);
const files = [];

function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (ignoreDirs.has(entry.name)) {
            continue;
        }

        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
}

walk(root);

for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], {
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        process.stderr.write(result.stderr || result.stdout);
        process.exit(result.status || 1);
    }
}

console.log(`Checked ${files.length} JavaScript files.`);
