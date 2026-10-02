import ExcelJS from 'exceljs';
import * as path from 'path';

async function searchProducts() {
  const filePath = path.join(process.cwd(), 'middleware', 'data', 'listaPrecios.xlsx');
  console.log(`Leyendo archivo: ${filePath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log('Hojas en listaPrecios.xlsx:', workbook.worksheets.map(w => w.name));
  const sheet = workbook.worksheets[0];
  console.log(`Total de filas: ${sheet.rowCount}`);

  // Mostrar encabezados (primeras 5 filas)
  for (let r = 1; r <= 4; r++) {
    const vals = (sheet.getRow(r).values as any[]).filter(Boolean);
    if (vals.length > 0) {
      console.log(`Fila ${r}:`, vals);
    }
  }

  // Buscar las columnas
  const headerRow = sheet.getRow(3);
  const headers: Record<string, number> = {};
  headerRow.eachCell((cell, colNumber) => {
    headers[String(cell.value).trim()] = colNumber;
  });
  console.log('\nColumnas detectadas:', headers);

  // Palabras clave a buscar
  const queries = ['bolsa', 'difusor', 'jabon', 'sahumerio', 'saphirus'];

  console.log('\n--- Búsqueda de productos que coincidan con las imágenes ---');
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < 4) return;
    const rowValues = row.values as any[];
    const rowText = rowValues.map(v => String(v || '')).join(' ').toLowerCase();

    for (const q of queries) {
      if (rowText.includes(q)) {
        console.log(`\n[Fila ${rowNumber}] Match '${q}':`);
        console.log('Valores:', rowValues.filter(Boolean));
        break;
      }
    }
  });
}

searchProducts().catch(err => console.error(err.message));
