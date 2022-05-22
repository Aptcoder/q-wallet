import express from 'express'
import userRouter from './user.routes'
import { accountRouter, accountsRouter } from './account.routes'
import webhookRouter from './webhooks'

const apiRouter = express.Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/account', accountRouter)
apiRouter.use('/webhook', webhookRouter)

export default apiRouter
