export const getLanguage = (fileName: string | undefined) => {
  if (!fileName) return 'text';
  const ext = fileName.split('.').pop()?.toLowerCase();

  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    jsonc: 'json',
    md: 'markdown',
    py: 'python',
    ipynb: 'python',
    r: 'r',
    java: 'java',
    kt: 'kotlin',
    kts: 'kotlin',
    swift: 'swift',
    dart: 'dart',
    go: 'go',
    sol: 'solidity',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    sh: 'bash',
    bash: 'bash',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',
    php: 'php',
    rb: 'ruby',
    pl: 'perl',
    sql: 'sql',
    ps1: 'powershell',
    graphql: 'graphql',
  };

  return map[ext || ''] || 'text';
};
