import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { GridColDef } from '@mui/x-data-grid';

interface ExportOptions {
  columns: GridColDef[];
  rows: any[];
}

export const handleExport = async ({ columns, rows }: ExportOptions) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Usuarios');

  worksheet.columns = columns.map(col => ({ header: col.headerName, key: col.field }));

  rows.forEach(row => {
    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
