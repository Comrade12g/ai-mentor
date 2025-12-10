import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';
import { PDFJSON, PPTJSON, ExcelJSON } from '../types';

export const Exporter = {
  
  async exportPDF(data: PDFJSON, fileName: string) {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let y = height - 50;
      const margin = 50;

      // Title
      page.drawText(data.pdf_title, {
        x: margin,
        y,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= 40;

      for (const section of data.sections) {
        if (y < 100) {
          page = pdfDoc.addPage();
          y = height - 50;
        }

        // Heading
        page.drawText(section.heading, {
          x: margin,
          y,
          size: 16,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= 20;

        // Content
        // Very basic text wrapping approximation for demo
        const words = section.content.split(' ');
        let line = '';
        for (const word of words) {
          if (line.length + word.length > 80) {
            page.drawText(line, { x: margin, y, size: 12, font: timesRomanFont });
            y -= 15;
            line = '';
          }
          line += word + ' ';
        }
        page.drawText(line, { x: margin, y, size: 12, font: timesRomanFont });
        y -= 30;
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `${fileName}.pdf`, 'application/pdf');
    } catch (e) {
      console.error("PDF Gen Error", e);
    }
  },

  async exportPPTX(data: PPTJSON, fileName: string) {
    try {
      const pptx = new PptxGenJS();
      
      data.slides.forEach(slideData => {
        let slide = pptx.addSlide();
        
        // Title
        slide.addText(slideData.title, { 
          x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '363636' 
        });

        // Bullets
        const items = slideData.bullets.map(b => ({ text: b, options: { fontSize: 14, breakLine: true } }));
        slide.addText(items, { x: 0.5, y: 1.5, w: '90%', h: '70%', bullet: true });
      });

      await pptx.writeFile({ fileName: `${fileName}.pptx` });
    } catch (e) {
      console.error("PPTX Gen Error", e);
    }
  },

  async exportExcel(data: ExcelJSON, fileName: string) {
    try {
      const wb = XLSX.utils.book_new();

      Object.entries(data.sheets).forEach(([sheetName, content]) => {
        // Combine header and rows
        const wsData = [content.columns, ...content.rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (e) {
      console.error("Excel Gen Error", e);
    }
  }
};

function downloadBlob(data: Uint8Array, fileName: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
