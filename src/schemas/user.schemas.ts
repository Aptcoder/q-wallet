import Joi from 'joi'
const createUserBodySchema = Joi.object().keys({
    firstName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
})

const authUserBodySchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export { createUserBodySchema, authUserBodySchema }
