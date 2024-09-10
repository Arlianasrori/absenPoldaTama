import joi from "joi"

const addAbsen = joi.object({
    keterangan : joi.string().required(),
    absen : joi.string().required()
})

export default {
    addAbsen
}