import puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generatePDFAbsen(data,islaporan) {
  try {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    let templatePath = ""
    
    if(islaporan){
      templatePath = join(__dirname, `../public/laporan/laporanAbsen(${data.start ? data.start : "-"} - ${data.end ? data.end : "-"}).pdf`);
    }else{
      templatePath = join(__dirname, `../public/rekap/rekapAbsen(${data.start ? data.start : "-"} - ${data.end ? data.end : "-"}).pdf`);
    }
    
    const path = join(__dirname, "../public/template-absen-pdf.ejs");
    // Gunakan promisify untuk mengubah ejs.renderFile menjadi Promise
    const renderFile = (path, data) => {
      return new Promise((resolve, reject) => {
        ejs.renderFile(path, data, {}, (err, str) => {
          if (err) reject(err);
          else resolve(str);
        });
      });
    };

    const html = await renderFile(path, data);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      path : templatePath,
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    await browser.close();
    
    console.log('PDF berhasil dibuat!');
    return pdfBuffer;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  }
}
