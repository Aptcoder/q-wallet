import { Router } from 'express'
import UserRepository from '../../repositories/user.respository'
import UserService from '../../services/user.service'
import UserController from '../../controllers/user.controller'
import { getConnection } from 'typeorm'
import validateRequest from '../../middlewares/validator'
import {
    createUserBodySchema,
    authUserBodySchema,
} from '../../schemas/user.schemas'
const userRepository =
    getConnection('q-wallet').getCustomRepository(UserRepository)

const userService = new UserService(userRepository)
const userRouter: Router = Router()

const userController = UserController(userService)

userRouter.post(
    '/',
    validateRequest(createUserBodySchema),
    userController.create
)
// router.get('/:userId', userController.getUser);
userRouter.post(
    '/auth',
    validateRequest(authUserBodySchema),
    userController.authUser
)

export default userRouter
