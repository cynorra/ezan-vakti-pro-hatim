import fs from 'fs';

const path = process.argv[2];
let text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');
let fixedCount = 0;

const fixedLines = lines.map((line) => {
  const m = line.match(/^(\s*"abdest\.step1":\s*")(.*)(",?)\s*$/);
  if (!m) return line;
  const [, prefix, inner, suffix] = m;
  const reEscaped = inner
    .split('')
    .map((ch, i) => {
      if (ch !== '"') return ch;
      // Zaten kaçışlı mı? (önceki karakter backslash ise dokunma)
      if (inner[i - 1] === '\\') return ch;
      return '\\"';
    })
    .join('');
  fixedCount++;
  return prefix + reEscaped + suffix;
});

fs.writeFileSync(path, fixedLines.join('\n'));
console.log('Fixed lines:', fixedCount);
