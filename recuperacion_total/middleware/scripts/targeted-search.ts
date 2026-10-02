import ExcelJS from 'exceljs';
import * as path from 'path';

async function targetedSearch() {
  const filePath = path.join(process.cwd(), 'middleware', 'data', 'listaPrecios.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];

  const queries = ['difusor', 'freezer', 'frezeer', 'saphirus'];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < 4) return;
    const rowValues = row.values as any[];
    const text = rowValues.map(v => String(v || '')).join(' ').toLowerCase();

    for (const q of queries) {
      if (text.includes(q)) {
        console.log(`[Fila ${rowNumber}] (${q}) -> Código: ${rowValues[5]}, Nombre: ${rowValues[6]}, Precio: ${rowValues[8]}`);
      }
    }
  });
}

targetedSearch().catch(err => console.error(err.message));
