import joi from "joi"

const addAnggota = joi.object({
    nama : joi.string().required(),
    nirp : joi.string().required(),
    pangkat : joi.string().required(),
    jabatan : joi.string().required(),
    password : joi.string().required(),
    satker: joi.string().required()
})
const updateAnggota = joi.object({
    nama : joi.string().optional(),
    nirp : joi.string().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    satker : joi.string().optional(),
    password : joi.string().optional()
})

// const alasanAbsenValidation = joi.object({
//     id_absen : joi.number().required(),
//     alasan : joi.string().required()
// })


const addAbsenvalidation = joi.object({
    id_anggota : joi.number().required(),
    dateTime : joi.string().required(),
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").required(),
    alasan : joi.string().optional()
})

const updateAlasanAbsenValidation = joi.object({
    alasan : joi.string().required()
})

const updateAbsenvalidation = joi.object({
    id_anggota : joi.number().optional(),
    String : joi.string().optional(),
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").optional(),
    dateTime : joi.string().optional(),
    alasan : updateAlasanAbsenValidation.optional()
})

const searchAnggota = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    page : joi.number().optional(),
    limit : joi.number().optional()
})

export default {
    addAnggota,updateAnggota,addAbsenvalidation,updateAbsenvalidation,searchAnggota
}