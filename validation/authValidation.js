import joi from "joi"

const loginValidation = joi.object({
    textBody : joi.string().max(255).required(),
    password : joi.string().required()
})

export default {
    loginValidation
}