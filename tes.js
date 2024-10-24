import {PdfReader} from 'pdfreader'

new PdfReader().parseFileItems("/home/lyntri/project/absen-polda/public/laporan/laporanAbsen(2024-09-11 - 2024-09-25).pdf",(err,item) => {
  if(item) {
    console.log(item.text);
  }
})