import joi from "joi"

const addAbsen = joi.object({
    keterangan : joi.string().required(),
    apel : joi.valid("pagi","siang").required()
})

const searchAbsenValidation = joi.object({
    nirp : joi.string().optional(),
    nama : joi.string().optional(),
    pangkat : joi.string().optional(),
    jabatan : joi.string().optional(),
    satker : joi.string().optional(),
    tanggal_mulai : joi.string().optional(),
    tanggal_selesai : joi.string().optional(),
    apel : joi.valid("pagi","siang").optional(),
    page : joi.number().optional(),
    limit : joi.number().optional(),
    isLaporan : joi.boolean().optional()
})

export default {
    addAbsen,
    searchAbsenValidation
}