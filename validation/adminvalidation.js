import joi from "joi"

const addAnggota = joi.object({
    nama : joi.string().required(),
    nirp : joi.string().required(),
    pangkat : joi.string().required(),
    jabatan : joi.string().required(),
    satker : joi.string().optional(),
    password : joi.string().required()
})
const updateAnggota = joi.object({
    nama : joi.string().optional(),
    nirp : joi.string().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    satker : joi.string().optional(),
    password : joi.string().optional()
})

const addAbsenvalidation = joi.object({
    id_anggota : joi.number().required(),
    dateTime : joi.string().required(),
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").required(),
    apel : joi.valid("pagi","siang").required()
})
const updateAbsenvalidation = joi.object({
    id_anggota : joi.number().optional(),
    String : joi.string().optional(),
    keterangan : joi.valid("H","DIK","I","C","S","TH","TG","TK").optional(),
    dateTime : joi.string().optional(),
    apel : joi.valid("pagi","siang").optional()
})

const searchAnggota = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    satker : joi.string().optional(),
    page : joi.number().optional(),
    limit : joi.number().optional()
})

const addAdminSatker = joi.object({
    nirp : joi.string().required(),
    nama : joi.string().required(),
    satker : joi.string().required(),
    password : joi.string().required()
})

const updateAdminSatker = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    password : joi.string().optional()
})

const searchAdminSatker = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    satker : joi.string().optional(),
    page : joi.number().optional().default(1),
    limit : joi.number().optional().default(10)
})

export default {
    addAnggota,updateAnggota,addAbsenvalidation,updateAbsenvalidation,searchAnggota,addAdminSatker,updateAdminSatker,searchAdminSatker
}