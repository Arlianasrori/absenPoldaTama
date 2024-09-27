import joi from "joi"

const addAbsen = joi.object({
    keterangan : joi.string().required(),
    absen : joi.string().required(),
    apel : joi.valid("pagi","sore").required()
})

export default {
    addAbsen
}