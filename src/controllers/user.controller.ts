import { Request, Response } from 'express'
import { IUserService } from '../utils/interfaces/services.interfaces'
import { processError } from '../utils/helpers'

export default (userService: IUserService) => ({
    test() {
        console.log('ma try e')
    },

    async create(req: Request, res: Response): Promise<void | Response> {
        try {
            const user = await userService.create(req.body)
            return res.status(201).send({
                message: 'User created',
                status: 'success',
                data: {
                    user,
                },
            })
        } catch (err) {
            return processError(res, err)
        }
    },

    async authUser(req: Request, res: Response): Promise<void | Response> {
        try {
            const { email, password } = req.body
            const { accessToken, user } = await userService.auth({
                email,
                password,
            })
            return res.send({
                status: 'success',
                message: 'User auth successful',
                data: {
                    token: accessToken,
                    user,
                },
            })
        } catch (err) {
            return processError(res, err)
        }
    },
})
