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
    const fileName = `${data.start ? data.start : "-"} - ${data.end ? data.end : "-"}`
    
    if(islaporan){
      templatePath = join(__dirname, `../public/laporan/laporan(${fileName}).pdf`);
    }else{
      templatePath = join(__dirname, `../public/rekap/rekapAbsen(${fileName}).pdf`);
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

    const detail_count = {}

    for(let i = 0; i < data.data.length; i++){
      if (data.data[i].keterangan in detail_count){
        detail_count[data.data[i].keterangan] += 1
      }else{
        detail_count[data.data[i].keterangan] = 1
      }
    }

    const listIDSiswa = []
    let countSiswa = 0
    let countHadir = 0

    for(let i = 0; i < data.data.length; i++){
      if (!listIDSiswa.includes(data.data[i].anggota.id)){
        listIDSiswa.push(data.data[i].anggota.id)
        countSiswa += 1
      }

      if (data.data[i].keterangan == "H"){
        countHadir += 1
      }
    }

    const html = await renderFile(path, {...data, detail_count, jumlah : data.data.length, countSiswa, countHadir});
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      path : templatePath,
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    await browser.close();
    
    console.log('PDF berhasil dibuat!');
    if(islaporan){
      return `http://localhost:3000/laporan/laporan(${fileName}).pdf`;
    }else{
      return `http://localhost:3000/laporan/rekap(${fileName}).pdf`;
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  }
}
