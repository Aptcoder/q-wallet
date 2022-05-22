import { NextFunction, Request, Response } from 'express'
import Joi, { Schema } from 'joi'

const validateRequest = (
    bodySchema: Schema | null = null,
    paramsSchema: Schema | null = null,
    querySchema: Schema | null = null
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (
            (bodySchema && !Joi.isSchema(bodySchema)) ||
            (paramsSchema && !Joi.isSchema(paramsSchema)) ||
            (querySchema && !Joi.isSchema(querySchema))
        ) {
            return next('Invalid schema passed to validator')
        }
        let errors: any[] = []
        if (bodySchema) {
            const { error: bodyError } = bodySchema.validate(req.body)
            if (bodyError) {
                errors = errors.concat(bodyError)
            }
        }

        if (paramsSchema) {
            const { error: paramsError } = paramsSchema.validate(req.params)
            if (paramsError) {
                errors = errors.concat(paramsError)
            }
        }

        if (querySchema) {
            const { error: queryError } = querySchema.validate(req.query)
            if (queryError) {
                errors = errors.concat(queryError)
            }
        }
        if (errors.length < 1) {
            return next()
        }
        let details: any[] = []
        errors.forEach((error) => {
            details = details.concat(error.details)
        })
        const messages = details.map((detail) => {
            return detail.message.replaceAll('"', '')
        })
        return res.status(400).send({
            status: 'error',
            message: messages[0],
            data: {},
        })
    }
}

export default validateRequest
