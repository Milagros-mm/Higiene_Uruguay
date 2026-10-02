const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain';

async function findStorefrontCode() {
  const folders = fs.readdirSync(logsDir);
  console.log("Buscando rastros del panel principal / e-commerce...");
  
  for (const folder of folders) {
    const transcriptPath = path.join(logsDir, folder, '.system_generated', 'logs', 'transcript_full.jsonl');
    if (!fs.existsSync(transcriptPath)) continue;
    
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    for await (const line of rl) {
      try {
        const entry = JSON.parse(line);
        // Si hay contenido de texto
        if (entry.content) {
          const contentLow = entry.content.toLowerCase();
          // Buscar indicios de página principal
          if (
            (contentLow.includes('export default function home') || 
             contentLow.includes('export default function page') || 
             contentLow.includes('className="hero"')) &&
            !contentLow.includes('admindashboardpage')
          ) {
             console.log(`\n--- Posible código encontrado en ${folder} ---`);
             console.log(entry.content.substring(0, 300) + '...');
          }
        }
      } catch(e) {}
    }
  }
}

findStorefrontCode();
