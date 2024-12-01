import joi from "joi"

// variable , type data, operator, logika or ama and, array, object , function. latihan :



// const alasanAbsenValidation = joi.object({
//     id_absen : joi.number().required(),
//     alasan : joi.string().required()
// })

const addAbsen = joi.object({
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").required(),
    alasan : joi.string().optional()
})

const searchAbsenValidation = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().empty().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    satker : joi.string().optional(),
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").optional(),
    tanggal_mulai : joi.string().optional(),
    tanggal_selesai : joi.string().optional(),
    page : joi.number().optional(),
    limit : joi.number().optional(),
    isLaporan : joi.boolean().optional()
})

export default {
    addAbsen,
    searchAbsenValidation
}