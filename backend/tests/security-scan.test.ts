import fs from 'fs';
import path from 'path';

describe('Test 5 — Zero Frontend & Repository Secret Exposure Audit', () => {
  const frontendDir = fs.existsSync(path.resolve(__dirname, '../../frontend'))
    ? path.resolve(__dirname, '../../frontend')
    : fs.existsSync(path.resolve(__dirname, '../frontend'))
    ? path.resolve(__dirname, '../frontend')
    : path.resolve(__dirname, '../../MEDMATCH AI FRONTEND');
  const backendDir = path.resolve(__dirname, '..');

  function scan(dir: string, patterns: RegExp[]): { file: string; match: string }[] {
    const leaks: { file: string; match: string }[] = [];
    if (!fs.existsSync(dir)) return leaks;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const ignore = ['node_modules', '.next', 'dist', '.git', 'coverage', '.system_generated'];

    for (const entry of entries) {
      if (ignore.includes(entry.name)) continue;
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        leaks.push(...scan(full, patterns));
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.json') || entry.name.endsWith('.html'))) {
        const content = fs.readFileSync(full, 'utf8');
        for (const p of patterns) {
          const m = content.match(p);
          if (m) {
            leaks.push({ file: full, match: m[0] });
          }
        }
      }
    }
    return leaks;
  }

  it('should verify that frontend code contains zero private keys, wallet mnemonics or secrets', () => {
    const forbidden = [
      /VITE_AVM_MNEMONIC/i,
      /VITE_PRIVATE_KEY/i,
      /NEXT_PUBLIC_AVM_MNEMONIC/i,
      /NEXT_PUBLIC_PRIVATE_KEY/i,
      /REACT_APP_PRIVATE_KEY/i,
      /FIREBASE_PRIVATE_KEY/i,
      /AVM_MNEMONIC\s*=/i,
      /ALGORAND_SENDER_MNEMONIC\s*=/i,
      /wealth frame smile exist zoo/i
    ];

    const leaks = scan(frontendDir, forbidden);
    expect(leaks).toEqual([]);
  });

  it('should verify that frontend .gitignore exists and ignores local env and build files', () => {
    const gitignorePath = path.join(frontendDir, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const content = fs.readFileSync(gitignorePath, 'utf8');
    expect(content).toContain('.env');
    expect(content).toContain('.env.local');
    expect(content).toContain('node_modules');
  });

  it('should verify that backend .gitignore exists and ignores .env', () => {
    const gitignorePath = path.join(backendDir, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const content = fs.readFileSync(gitignorePath, 'utf8');
    expect(content).toContain('.env');
  });

  it('should verify that .env.example files contain only placeholders and no real secrets', () => {
    const backendExample = path.join(backendDir, '.env.example');
    if (fs.existsSync(backendExample)) {
      const content = fs.readFileSync(backendExample, 'utf8');
      expect(content).not.toContain('wealth frame smile');
    }
  });
});
