import Joi from 'joi'
const makeTransferBodySchema = Joi.object().keys({
    userId: Joi.string().required(),
    amount: Joi.number().min(50).required(),
    narration: Joi.string(),
})

export { makeTransferBodySchema }
