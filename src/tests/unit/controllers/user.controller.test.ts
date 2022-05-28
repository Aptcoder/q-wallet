import { IUserService } from '../../../utils/interfaces/services.interfaces'
import UserController from '../../../controllers/user.controller'
import { Request, Response } from 'express'

describe('User controller', () => {
    const mockUserService: IUserService = {
        create() {},
        auth() {},
        _comparePassword(inputPass: string, password: string) {
            return Promise.resolve(true)
        },

        _generateToken({}) {
            return Promise.resolve({ accessToken: 'sampletoken' })
        },
    }

    let userController = UserController(mockUserService)

    const mockReq = {} as unknown as Request

    const mockRes = {
        status() {
            return this
        },
        send: jest.fn(),
    } as unknown as Response

    beforeEach(() => {})

    it('Should call create user service  function', async () => {
        const createSpy = jest.spyOn(mockUserService, 'create')
        await userController.create(mockReq, mockRes)
        expect(createSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
            })
        )
    })

    it('Should call auth service function', async () => {
        const req_body = {
            email: 'samuel@gmail.com',
            password: 'samuel',
        }
        const authSpy = jest.spyOn(mockUserService, 'auth')
        const req = {
            ...mockReq,
            body: req_body,
        } as Request
        await userController.authUser(req, mockRes)
        expect(authSpy).toHaveBeenCalled()
        expect(authSpy).toHaveBeenCalledWith(req_body)
    })
})
