import ExcelJS from 'exceljs';
import * as path from 'path';

async function inspectExcel() {
  const filePath = path.join(process.cwd(), 'middleware', 'data', 'ListaPreciosProductos.xlsx');
  console.log(`Leyendo archivo: ${filePath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log(`Hojas encontradas: ${workbook.worksheets.map(w => w.name).join(', ')}`);
  const sheet = workbook.worksheets[0];
  console.log(`Total de filas con datos en la hoja 1: ${sheet.rowCount}`);

  console.log('\n--- Encabezados (Fila 1) ---');
  const headers = sheet.getRow(1).values as any[];
  console.log(headers.filter(Boolean));

  console.log('\n--- Fila 2 (Primer producto de ejemplo) ---');
  const row2 = sheet.getRow(2).values as any[];
  console.log(row2.filter(Boolean));
}

inspectExcel().catch(err => console.error(err.message));
