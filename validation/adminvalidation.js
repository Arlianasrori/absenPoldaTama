import joi from "joi"

const addAnggota = joi.object({
    nama : joi.string().required(),
    nirp : joi.string().required(),
    pangkat : joi.string().required(),
    jabatan : joi.string().required(),
    satker : joi.string().required(),
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
    dateTime : joi.date().required(),
    keterangan : joi.string().required(),
    apel : joi.valid("pagi","sore").required()
})
const updateAbsenvalidation = joi.object({
    id_anggota : joi.number().optional(),
    dateTime : joi.date().optional(),
    keterangan : joi.string().optional(),
    apel : joi.valid("pagi","sore").optional()
})

const searchAbsenValidation = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    pangkat : joi.string().optional(),
    satker : joi.string().optional(),
    tanggal_mulai : joi.date().optional(),
    tanggal_selesai : joi.date().optional(),
    apel : joi.valid("pagi","sore").optional()
})
export default {
    addAnggota,updateAnggota,addAbsenvalidation,updateAbsen,updateAbsenvalidation,searchAbsenValidation
}