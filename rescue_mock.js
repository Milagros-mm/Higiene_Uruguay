const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain';
const workspaceDir = 'C:\\Users\\User\\PracticasSupervisadas';

async function recoverMockData() {
  console.log('Buscando mock-data y otros utilitarios perdidos...');
  const folders = fs.readdirSync(logsDir);
  let filesRecovered = 0;
  
  for (const folder of folders) {
    const transcriptPath = path.join(logsDir, folder, '.system_generated', 'logs', 'transcript_full.jsonl');
    if (!fs.existsSync(transcriptPath)) continue;
    
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    for await (const line of rl) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === 'VIEW_FILE' && entry.status === 'DONE' && entry.content) {
            const contentStr = entry.content;
            
            const match = contentStr.match(/File Path: `file:\/\/\/([a-zA-Z]:\/[^`]+)`/);
            if (match) {
                let filePath = match[1].replace(/\//g, '\\');
                
                // Si es mock-data.ts o utilitarios
                if (filePath.toLowerCase().includes('mock-data') || filePath.toLowerCase().includes('utils.ts') || filePath.toLowerCase().includes('types/index.ts')) {
                    const lines = contentStr.split('\n');
                    let codeLines = [];
                    let isCode = false;
                    for (const l of lines) {
                        if (l.match(/^\d+:/)) {
                            codeLines.push(l.replace(/^\d+:\s?/, ''));
                            isCode = true;
                        } else if (isCode && l.startsWith('The above content shows the entire')) {
                            break;
                        }
                    }
                    
                    if (codeLines.length > 0) {
                        // Recrear en la ruta correcta
                        let finalPath = '';
                        if (filePath.toLowerCase().includes('mock-data')) {
                            finalPath = path.join(workspaceDir, 'frontend', 'mock', 'mock-data.ts');
                        } else if (filePath.toLowerCase().includes('utils.ts')) {
                            finalPath = path.join(workspaceDir, 'frontend', 'utils', 'utils.ts');
                        } else if (filePath.toLowerCase().includes('types')) {
                            finalPath = path.join(workspaceDir, 'frontend', 'types', 'index.ts');
                        }

                        fs.mkdirSync(path.dirname(finalPath), { recursive: true });
                        fs.writeFileSync(finalPath, codeLines.join('\n'), 'utf-8');
                        console.log(`✅ Rescatado: ${finalPath}`);
                        filesRecovered++;
                    }
                }
            }
        }
      } catch(e) {}
    }
  }
}

recoverMockData();
