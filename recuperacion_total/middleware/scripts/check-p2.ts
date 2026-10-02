import ExcelJS from 'exceljs';
import * as path from 'path';

async function checkP2() {
  const filePath = path.join(process.cwd(), 'middleware', 'data', 'ListaP2.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  console.log('ListaP2 sheets:', workbook.worksheets.map(w => w.name));
  const sheet = workbook.worksheets[0];
  console.log('RowCount:', sheet.rowCount);
  for (let r = 1; r <= 5; r++) {
    console.log(`Fila ${r}:`, (sheet.getRow(r).values as any[]).filter(Boolean));
  }
}

checkP2().catch(err => console.error(err.message));
