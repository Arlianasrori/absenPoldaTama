import xl from "xlsx"
import { db } from "./config/prismaClient.js";

const workbook = xl.readFile('absen.xlsx');
// Dapatkan nama sheet pertama
const sheetName = workbook.SheetNames;

// Dapatkan sheet yang diinginkan
const sheet = workbook.Sheets;

// Konversi sheet ke array of objects
const data = xl.utils.sheet_to_json(sheet["Sheet1"]);

console.log(data.length);

let adaAnggota = 0

// const nrpanggota = []
// const dataAnggota = []
// for (let i = 0; i < data.length; i++) {
//     const row = data[i];
//     console.log(nrpanggota);
    
import pdfTableExtractor from 'pdf-table-extractor';

async function konversiPDFkeCSV(jalurPDF) {
  try {
    const result = await new Promise((resolve, reject) => {
      pdfTableExtractor(jalurPDF, resolve, reject);
    });

    // console.log(result.pageTables[0].tables);
    const dataRow = []

    for(let i = 3; i < result.pageTables[0].tables.length; i++) {
      // console.log(result.pageTables[0].tables[i]);
      const dataMapping = {
        NRP: result.pageTables[0].tables[i][1],
        Nama: result.pageTables[0].tables[i][2],
        Pangkat: result.pageTables[0].tables[i][3],
        Jabatan: result.pageTables[0].tables[i][4],
        Tanggal: result.pageTables[0].tables[i][5],
        Satker: result.pageTables[0].tables[i][6],
        Keterangan: result.pageTables[0].tables[i][7],
      }
      dataRow.push(dataMapping)
    }

    console.log(dataRow);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

const jalurPDF = '/home/lyntri/project/absen-polda/public/laporan/laporanAbsen(2024-09-11 - 2024-09-25).pdf';

konversiPDFkeCSV(jalurPDF);
