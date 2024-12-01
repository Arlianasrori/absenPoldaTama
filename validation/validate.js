import responseError from "../error/responseError.js"
export const validate = async (schema,object) => {
    const result = await schema.validate(object)
    console.log(result);
    
    if(result.error) {
        throw new responseError(400,result.error.message)
    }
    return result.value
}