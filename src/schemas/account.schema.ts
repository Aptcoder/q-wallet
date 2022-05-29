import Joi from 'joi'
const makeTransferBodySchema = Joi.object().keys({
    userId: Joi.string().required(),
    amount: Joi.number().min(50).required(),
    narration: Joi.string(),
})
const fundAccountBody = Joi.object().keys({
    amount: Joi.number().min(50).required(),
})

const withdrawBody = Joi.object().keys({
    amount: Joi.number().min(50).required(),
    beneficiary: Joi.string().uuid().required(),
})
export { makeTransferBodySchema, fundAccountBody, withdrawBody }
