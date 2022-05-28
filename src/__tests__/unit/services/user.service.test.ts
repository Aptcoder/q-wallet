import { ConflictError, NotFoundError } from '../../../utils/errors'
import User from '../../../entities/user.entity'
import { IUserService } from '../../../utils/interfaces/services.interfaces'
import UserService from '../../../services/user.service'
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

    it('SHould throw error on create if user with email exists', async () => {
        const findByEmailSpy = jest.spyOn(mockUserRepository, 'findByEmail')
        try {
            await userService.create({ ...sample_user })
        } catch (err) {
            expect(err).toBeInstanceOf(ConflictError)
            expect(findByEmailSpy).toHaveBeenCalled()
        }
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
        try {
            const result = await userService.auth({
                email: 'sample@gmail.com',
                password: 'samplemilz',
            })
        } catch (err: any) {
            expect(err).toBeInstanceOf(NotFoundError)
            expect(findByEmailSpy).toHaveBeenCalled()
            expect(userService._comparePassword).not.toHaveBeenCalled()
        }
    })
})
