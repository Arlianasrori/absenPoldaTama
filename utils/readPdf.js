import pdfTableExtractor from 'pdf-table-extractor';
import fs from "fs"

export async function readPdf(jalurPDF) {
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

    // console.log(dataRow);

    return dataRow
}

// const jalurPDF = '/home/lyntri/project/absen-polda/public/laporan/laporanAbsen(2024-09-11 - 2024-09-25).pdf';

// konversiPDFkeCSV(jalurPDF);