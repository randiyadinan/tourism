const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('npm run build 2>&1', { encoding: 'utf-8' });
  console.log('Build passed!');
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
      
      const regex = new RegExp(`import\\s+\\{([^}]*\\b${typeName}\\b[^}]*)\\}\\s+from\\s+['"]([^'"]+)['"]`);
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

  // Fix TS6133 (unused vars)
  for (const line of unusedVarsErrors) {
    const match = line.match(/(src\/.*\.tsx?)\(\d+,\d+\): error TS6133: '([^']+)' is declared/);
    if (match) {
      const file = match[1];
      const varName = match[2];
      let content = fs.readFileSync(file, 'utf-8');
      
      // Simple regex to remove the unused variable from import { ... }
      const regex = new RegExp(`\\b${varName}\\b\\s*,?`, 'g');
      content = content.replace(regex, '');
      
      // Fix empty imports or trailing commas
      content = content.replace(/,\s*\}/g, ' }');
      content = content.replace(/\{\s*,/g, '{ ');
      content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?/g, '');
      
      // Special case: `const { varName, other } = useSomething();`
      // We can try to handle destructuring in simple cases
      content = content.replace(new RegExp(`const\\s*\\{\\s*([^}]*?)\\s*\\}\\s*=\\s*useAuth\\(\\);`), (match, vars) => {
          if (vars.trim() === '') return '';
          return `const { ${vars} } = useAuth();`;
      });
      // Handle unused setVehicles in ManageVehiclesPage
      if (varName === 'setVehicles') {
        content = content.replace(/const \[vehicles, setVehicles\] = useState<Vehicle\[\]>\(\[\]\);/g, 'const [vehicles] = useState<Vehicle[]>([]);');
        content = content.replace(/const \[vehicles, setVehicles\] = useState/g, 'const [vehicles] = useState');
      }
      
      // Handle unused stats in ReportsPage
      if (varName === 'stats' || varName === 'monthlyRevenue' || varName === 'popularTours') {
        content = content.replace(new RegExp(`const ${varName} = [^;]+;`), '');
      }

      fs.writeFileSync(file, content);
      console.log(`Fixed TS6133 for ${varName} in ${file}`);
    }
  }
}
