// import { log } from "console";
// import fs from "fs";
// import PDFParser from "pdf2json"; 

// const pdfParser = new PDFParser();

// pdfParser.on("pdfParser_dataError", (errData) =>
//  console.error(errData.parserError)
// );
// pdfParser.on("pdfParser_dataReady", (pdfData) => {
//  for (let i = 0; i < 1; i++) {
//   pdfData.Pages[i].Texts.forEach((element,k) => {
//     let count = 0;
//     if (k > 172) {
//       console.log(decodeURIComponent(element.R[0].T)  );
      
//       // count += 1; 
//       // let text;
//       // if (count % 6 != 0) {
//       //   if (count % 5 == 0) {
//       //     console.log(decodeURIComponent(element.R[0].T));
//       //     text = decodeURIComponent(element.R[0].T) + pdfData.Pages[i].Texts[k+1].R[0].T;
//       //     // text = decodeURIComponent(element.R[0].T);
//       //     // console.log(pdfData.Pages[i].Texts[k+1].R[0].T);
          
//       //   }else {
//       //     text = decodeURIComponent(element.R[0].T)  
//       //   }       
//       // }


//       // console.log(text)
      
//     }
    
//   });
// }
 
// });

// pdfParser.loadPDF("./laporan(2024-07-15 - 2024-07-22).pdf");





import fs from "fs"
import pdf from "pdf-parse"

const pdfPath = './laporan\\(2024-07-15 - 2024-07-22\\).pdf'; // Escaping the parentheses
 // Ganti dengan path file PDF yang ingin dibaca

const dataBuffer = fs.readFileSync(pdfPath);
console.log(dataBuffer);


pdf(dataBuffer).then(function(data) {
    // Data yang diekstrak dari PDF
    console.log(data.text); // Cetak teks dari PDF
    // Kamu juga bisa memeriksa informasi lain seperti jumlah halaman
    console.log(data.numpages);
    console.log(data.info);
}).catch(error => {
    console.error('Error reading PDF:', error);
});
