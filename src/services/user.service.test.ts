import { ConflictError } from "../utils/errors"
import { IUserRepository } from "../utils/interfaces/repos.interfaces"
import User from "../entities/user.entity"
import { IUserService } from "../utils/interfaces/services.interfaces"
import UserService from "./user.service"


describe('User service', () => {
    let userService: IUserService
    const sample_user = {
        email: 'sample@gmail.com',
        firstName: 'Sample',
        lastName: 'Gmail',
        phoneNumber: '',
        password: 'samplepassword'
    }
    const user = new User()
    const mockUserRepository: IUserRepository = {
        create(){
            return user
        },
        findByEmail(){
            return Promise.resolve(user)
        },
        save(){
            return Promise.resolve(user)
        }
    }

    beforeEach(() => {
        userService = new UserService(mockUserRepository)
    })
    it('Should create a user', async () => {
        const createSpy = jest.spyOn(mockUserRepository, 'create')
        const saveSpy = jest.spyOn(mockUserRepository, 'save')
        const findByEmailSpy = jest.spyOn(mockUserRepository, 'findByEmail').mockImplementation(() => { return Promise.resolve(undefined) })
        await userService.create({...sample_user})

        expect(createSpy).toHaveBeenCalled()
        expect(findByEmailSpy).toHaveBeenCalled()
        expect(saveSpy).toHaveBeenCalled()
    })

    it('SHould throw error on create if user with email exists', async () => {
        const findByEmailSpy = jest.spyOn(mockUserRepository, 'findByEmail')
        try {
            await userService.create({...sample_user})
        } catch(err){
            expect(err).toBeInstanceOf(ConflictError)
            expect(findByEmailSpy).toHaveBeenCalled()
        }
    })
})