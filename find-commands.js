const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain';

async function findCommands() {
  const folders = fs.readdirSync(logsDir);
  console.log("Comandos ejecutados en el pasado:");
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
            if (tc.name === 'run_command' && tc.args && tc.args.CommandLine) {
               const cmd = tc.args.CommandLine;
               if (cmd.includes('create') || cmd.includes('install') || cmd.includes('frontend') || cmd.includes('backend') || cmd.includes('init')) {
                   console.log(`- ${cmd}`);
               }
            }
          }
        }
      } catch(e) {}
    }
  }
}

findCommands();
