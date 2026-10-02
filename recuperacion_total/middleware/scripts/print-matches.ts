import ExcelJS from 'exceljs';
import * as path from 'path';

async function printMatches() {
  const filePath = path.join(process.cwd(), 'middleware', 'data', 'listaPrecios.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];

  const rowIndices = [112, 358, 618, 1002, 62];
  
  // Encabezados
  const headers = sheet.getRow(3).values as any[];
  console.log('Encabezados:', headers);

  for (const idx of rowIndices) {
    const row = sheet.getRow(idx).values as any[];
    console.log(`\n--- Fila ${idx} ---`);
    headers.forEach((h, col) => {
      if (h && row[col] !== undefined) {
        console.log(`  ${String(h).trim()}: ${row[col]}`);
      }
    });
  }
}

printMatches().catch(err => console.error(err.message));
