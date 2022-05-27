import express from 'express'
import userRouter from './user.routes'
import { accountRouter, accountsRouter } from './account.routes'
import webhookRouter from './webhooks'
import beneficiaryRouter from './beneficiary.routes'

const apiRouter = express.Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/account', accountRouter)
apiRouter.use('/webhook', webhookRouter)
apiRouter.use('/beneficiaries', beneficiaryRouter)

export default apiRouter
