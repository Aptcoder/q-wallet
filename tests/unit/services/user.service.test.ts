import { ConflictError, NotFoundError } from '../../../src/utils/errors'
import User from '../../../src/entities/user.entity'
import { IUserService } from '../../../src/utils/interfaces/services.interfaces'
import UserService from '../../../src/services/user.service'
import { mockUserRepository } from '../../mocks/repo.mocks'

describe('User service', () => {
    let userService: IUserService
    const sample_user = {
        email: 'sample@gmail.com',
        firstName: 'Sample',
        lastName: 'Gmail',
        phoneNumber: '',
        password: 'samplepassword',
    }
    const user = new User()

    beforeEach(() => {
        userService = new UserService(mockUserRepository)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Should create a user', async () => {
        const createSpy = jest.spyOn(mockUserRepository, 'create')
        const saveSpy = jest.spyOn(mockUserRepository, 'save')
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(undefined)
            })
        await userService.create({ ...sample_user })

        expect(createSpy).toHaveBeenCalled()
        expect(findByEmailSpy).toHaveBeenCalled()
        expect(saveSpy).toHaveBeenCalled()
    })

    it('Should throw error on create if user with email exists', async () => {
        const findByEmailSpy = jest.spyOn(mockUserRepository, 'findByEmail')
        expect(async () => {
            await userService.create({ ...sample_user })
        }).rejects.toBeInstanceOf(ConflictError)
    })

    it('Should auth user if password correct', async () => {
        userService._comparePassword = jest.fn().mockResolvedValue(true)
        userService._generateToken = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ accessToken: 'sampletoken ' })
            )
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(user)
            })
        const result = await userService.auth({
            email: 'sample@gmail.com',
            password: 'samplemilz',
        })

        expect(findByEmailSpy).toHaveBeenCalled()
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('user')
    })

    it('Should throw not found if user not found', async () => {
        userService._comparePassword = jest.fn().mockResolvedValue(true)
        userService._generateToken = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ accessToken: 'sampletoken ' })
            )
        const findByEmailSpy = jest
            .spyOn(mockUserRepository, 'findByEmail')
            .mockImplementation(() => {
                return Promise.resolve(undefined)
            })
        expect(async () => {
            const result = await userService.auth({
                email: 'sample@gmail.com',
                password: 'samplemilz',
            })
        }).rejects.toBeInstanceOf(NotFoundError)
    })
})
