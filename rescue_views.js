const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain';
const destDir = 'C:\\Users\\User\\PracticasSupervisadas\\frontend'; // Lo volcamos a frontend para que coincida con los imports actuales

async function recoverFromViews() {
  console.log('Iniciando rescate de archivos a partir de lecturas (VIEW_FILE)...');
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
            
            // Buscar "File Path: `file:///c:/Users/User/PracticasSupervisadas/..."
            const match = contentStr.match(/File Path: `file:\/\/\/([a-zA-Z]:\/[^`]+)`/);
            if (match) {
                let filePath = match[1].replace(/\//g, '\\');
                
                // Solo nos interesan los componentes que faltan (layout, home)
                if (filePath.toLowerCase().includes('components') && !filePath.toLowerCase().includes('admin')) {
                    
                    // Extraer el código saltando las líneas que empiezan con número
                    // Formato: "1: import {..."
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
                        // Calcular ruta destino dentro de frontend
                        const relativePath = filePath.replace(/\\/g, '/').split(/components\//i)[1];
                        if (relativePath) {
                            const outPath = path.join(destDir, 'components', relativePath);
                            fs.mkdirSync(path.dirname(outPath), { recursive: true });
                            fs.writeFileSync(outPath, codeLines.join('\n'), 'utf-8');
                            console.log(`✅ Rescatado desde vista: components/${relativePath}`);
                            filesRecovered++;
                        }
                    }
                }
            }
        }
      } catch(e) {}
    }
  }
  console.log(`\n🎉 Rescate desde vistas finalizado. Se encontraron ${filesRecovered} capturas de código.`);
}

recoverFromViews();
