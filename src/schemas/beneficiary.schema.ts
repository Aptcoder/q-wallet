import Joi from 'joi'
const createBeneficiaryBodySchema = Joi.object().keys({
    bank_account: Joi.string().required().length(10),
    bank_code: Joi.string().required(),
})

export { createBeneficiaryBodySchema }
