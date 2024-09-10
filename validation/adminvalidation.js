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

export default {
    addAnggota,updateAnggota
}