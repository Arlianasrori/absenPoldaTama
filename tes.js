
import xl from "xlsx"
import { db } from "./config/prismaClient.js";

const workbook = xl.readFile('absen.xlsx');
// Dapatkan nama sheet pertama
const sheetName = workbook.SheetNames;

// Dapatkan sheet yang diinginkan
const sheet = workbook.Sheets;

// Konversi sheet ke array of objects
const data = xl.utils.sheet_to_json(sheet["Sheet1"]);

// nama
// nirp
// pangkat
// jabatan
// satker
// password

// let dataNirp = []
// let dataMappingDb = []
// for (let i = 0; i < data.length; i++) {
//   if(dataNirp.includes(data[i].NRP)){
    
//   }else{
//     dataNirp.push(data[i].NRP)
//     const dataMapping = {
//       nama: data[i].Nama.replace("\n", ""),
//       nirp: data[i].NRP.replace("\n", ""),
//       pangkat: data[i].Pangkat.replace("\n", ""),
//       jabatan: data[i].Jabatan.replace("\n", ""),
//       satker: data[i].Satker.replace("\n", ""),
//       password: data[i].Nama.replace("\n", ""),
//     }

//     dataMappingDb.push(dataMapping)
//   }
  
// }

// console.log(dataMappingDb);

// absen
console.log(data);

const DbMapping = []
for (let i = 0; i < data.length; i++) {
  const anggota = await db.anggota.findFirst({
    where: {
      nirp: data[i].NRP.replace("\n", ""),
    }
  })

  if(anggota){
    const keteranganAbsen = {
      HADIR : "H",
      PENDIDIKAN : "DIK",
      IZIN : "I",
      CUTI : "C",
      SAKIT : "S",
      TAH : "TAH",
      TUGAS : "TGS",
    }
    const mapping = {
      id_anggota : anggota.id,
      dateTime : data[i].Tanggal,
      keterangan : keteranganAbsen[data[i].Keterangan] ? keteranganAbsen[data[i].Keterangan] : "H" 
    }
    DbMapping.push(mapping)
  }
  
}

// id_anggota
// dateTime
// keterangan

console.log(DbMapping);
