import { IUserService } from "../utils/interfaces/services.interfaces";
import UserController from "./user.controller"
import { Request, Response } from 'express'
import { send } from "process";


describe('User controller', () => {
    const mockUserService: IUserService = {
        create(){}
    }

    let userController = UserController(mockUserService)
    
    const mockReq = {
        
    } as unknown as Request

    const mockRes = {
        status(){
            return this
        },
        send: jest.fn()
    } as unknown as Response

    beforeEach(() => {

    })

    it('Should call create user service  function', async () => {
        const createSpy = jest.spyOn(mockUserService, 'create')
        await userController.create(mockReq , mockRes);
        expect(createSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    })
})