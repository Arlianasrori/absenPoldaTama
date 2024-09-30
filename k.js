import puppeteer from 'puppeteer';
import fs from 'fs';

async function generatePDF() {
  try {
    // Buka browser
    const browser = await puppeteer.launch();
    
    // Buat halaman baru
    const page = await browser.newPage();
    
    // Baca file HTML
    const html = fs.readFileSync("tes.html", 'utf8');
    
    // Atur konten halaman dengan HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Buat PDF
    await page.pdf({
      path: 'attendance_record.pdf',
      format: 'A4',
      printBackground: true
    });
    
    // Tutup browser
    await browser.close();
    
    console.log('PDF berhasil dibuat!');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

generatePDF();