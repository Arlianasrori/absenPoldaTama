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
    

//     if (typeof row == "object") {
//         if (!nrpanggota.includes(row.NRP)) {
//             const dataMapp = {
//                 nama : row.Nama,
//                 nirp : row.NRP,
//                 pangkat : row.Pangkat,
//                 jabatan : row.Jabatan,
//                 satker : row.Satker,
//                 password : row.Nama
//             }

//             console.log(dataMapp.nirp);
            
//             await db.anggota.create({data : dataMapp})
//             nrpanggota.push(row.NRP)
// }
//     }
// }

// console.log(dataAnggota);
// await db.anggota.createMany({data : dataAnggota})

    

// console.log(adaAnggota);
for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (typeof row == "object") {
    const findIdAnggota = await db.anggota.findUnique({
        where : {
            nirp : row.NRP
        }
    })

    const keteranganMapp = {
        HADIR : "H",
        IJIN : "I",
        TUGAS : "C",
        SAKIT : "S",
        DIK : "DIK",
        CUTI : "C",
        TAH : "TAH",
        "TK" : "TK",
    }

    console.log(row.Keterangan);
    
    if (findIdAnggota) {
        adaAnggota += 1
        const dataMapping = {
            id_anggota : findIdAnggota.id,
            dateTime : row.Tanggal,
            keterangan : row.Keterangan ? keteranganMapp[row.Keterangan] : "H", 
            apel : row.Apel.toLowerCase()
        }
        console.log(dataMapping);
        
        await db.absensi.create({
            data : dataMapping
        })
    }
    }
    console.log(i);
    
}

// console.log(adaAnggota);
