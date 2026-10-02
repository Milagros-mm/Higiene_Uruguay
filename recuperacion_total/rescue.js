const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain';
const workspaceDir = 'C:\\Users\\User\\PracticasSupervisadas';

async function recover() {
  console.log('Iniciando rescate de archivos perdidos...');
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
        if (entry.tool_calls) {
          for (const tc of entry.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile && tc.args.CodeContent) {
               const target = tc.args.TargetFile.replace(/\\\\/g, '\\');
               // Solo recuperamos lo que estaba en frontend, backend, o app
               if (target.toLowerCase().includes('frontend') || target.toLowerCase().includes('backend') || target.toLowerCase().includes('app')) {
                   // Calcular la ruta destino asegurando que caiga en la carpeta actual
                   const relativePath = target.replace(/\\/g, '/').split('PracticasSupervisadas/')[1] || path.basename(target);
                   if (!relativePath) continue;
                   
                   const outPath = path.join(workspaceDir, relativePath);
                   fs.mkdirSync(path.dirname(outPath), { recursive: true });
                   fs.writeFileSync(outPath, tc.args.CodeContent, 'utf-8');
                   filesRecovered++;
                   console.log(`✅ Rescatado: ${relativePath}`);
               }
            }
          }
        }
      } catch(e) {
        // Ignorar lineas malformadas
      }
    }
  }
  console.log(`\n🎉 Rescate finalizado. Se han recuperado las versiones base de ${filesRecovered} archivos.`);
}

recover();