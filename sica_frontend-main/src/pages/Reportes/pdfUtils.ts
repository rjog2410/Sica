import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';

// Definición de interfaces
interface ReporteConciliacion {
  cuenta: string;
  ente: string;
  importe_sif: number;
  importe_operativo: number;
  diferencia: number;
}

interface FiltrosReporte {
  sistema: string;
  modulo: string;
  fecha: string; // Asegúrate de que la fecha esté en formato ISO
  agrupacion: string;
}

// Inicialización de pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Función para formatear números
const formatNumber = (value: number): string => {
  return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Función para formatear fechas
const formatDate = (date: string, withTime = false): string => {
  if (!date) return '';
  const format = withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
  return moment(date).format(format);
};

// Función para generar y descargar el PDF
export const savePDF = (data: ReporteConciliacion[], filtros: FiltrosReporte) => {
  const docDefinition: any = {
    pageMargins: [20, 60, 20, 60], // Margen ajustado
    content: [
      { text: 'Reporte Conciliación de Saldos', style: 'header' },
      { text: `Sistema: ${filtros.sistema}`, style: 'subheader' },
      { text: `Módulo: ${filtros.modulo}`, style: 'subheader' },
      { text: `Fecha: ${formatDate(filtros.fecha)}`, style: 'subheader' },
      { text: `Agrupación: ${filtros.agrupacion}`, style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: [80, '*', 100, 100, 100], // Ajustar anchos de columna
          body: [
            ['Cuenta', 'Ente', 'Importe SIF', 'Importe Operativo', 'Diferencia'],
            ...data.map(row => [
              row.cuenta.slice(0, 10), // Truncar texto si es necesario
              row.ente.slice(0, 10),
              formatNumber(row.importe_sif),
              formatNumber(row.importe_operativo),
              formatNumber(row.diferencia)
            ])
          ]
        },
        layout: {
          fillColor: '#f3f3f3',
          hLineColor: '#aaa',
          vLineColor: '#aaa',
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 8,
          paddingBottom: () => 8
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 5, 0, 5]
      },
      tableExample: {
        margin: [0, 10, 0, 15],
        fontSize: 8 // Ajustar tamaño de fuente
      }
    }
  };

  const fileName = `ReporteConciliacion_${formatDate(new Date().toISOString(), false).replace(/\//g, '')}.pdf`;

  pdfMake.createPdf(docDefinition).download(fileName);
};
