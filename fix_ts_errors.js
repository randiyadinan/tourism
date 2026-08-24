const fs = require('fs');
const { execSync } = require('child_process');

try {
  const output = execSync('npm run build 2>&1', { encoding: 'utf-8' });
} catch (e) {
  const lines = e.stdout.split('\n');
  const typeImportErrors = lines.filter(l => l.includes('error TS1484'));
  const unusedVarsErrors = lines.filter(l => l.includes('error TS6133'));
  
  // Fix TS1484 (type imports)
  for (const line of typeImportErrors) {
    const match = line.match(/(src\/.*\.tsx?)\(\d+,\d+\): error TS1484: '([^']+)' is a type/);
    if (match) {
      const file = match[1];
      const typeName = match[2];
      let content = fs.readFileSync(file, 'utf-8');
      
      // If it's a type from a service or types file
      // A simple regex approach to add 'type' if missing
      const regex = new RegExp(`import\\s+\\{([^}]*\\b${typeName}\\b[^}]*)\\}\\s+from\\s+['"]([^'"]+)['"]`, 'g');
      content = content.replace(regex, (match, imports, path) => {
         if (!match.includes('type ')) {
            return `import type { ${imports.trim()} } from '${path}'`;
         }
         return match;
      });
      fs.writeFileSync(file, content);
      console.log(`Fixed TS1484 for ${typeName} in ${file}`);
    }
  }
}
