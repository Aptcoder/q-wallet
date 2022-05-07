import Joi from "joi"
const createUserBodySchema = Joi.object().keys({
    firstName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required()
})


export { createUserBodySchema }