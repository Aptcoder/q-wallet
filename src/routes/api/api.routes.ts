import express from 'express'
import userRouter from './user.routes'
import { accountRouter, accountsRouter } from './account.routes'

const apiRouter = express.Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/account', accountRouter)

export default apiRouter
