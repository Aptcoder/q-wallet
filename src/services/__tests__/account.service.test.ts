
import Account from "../../entities/account.entity";
import Transaction from "../../entities/transaction.entity";
import { NotFoundError } from "../../utils/errors";
import { IAccountRepository, ITransactionRepository } from "../../utils/interfaces/repos.interfaces"
import { IAccountService } from "../../utils/interfaces/services.interfaces";
import AccountService from "../account.services";

describe('Account service', () => {
    it('A + B', () => {
        expect(1+1).toBe(2)
    })

    let accountService: IAccountService;

    const account = new Account()

    const mockAccountRepository: IAccountRepository = {
        findOne({}){
            return Promise.resolve(account)
        },
        update({}){},
        findByUserId(userId: string){
            return Promise.resolve(undefined)
        },
        updateBalance(account, amount, inc): Promise<Account>{
            return Promise.resolve(account)
        }
    }

    const transaction = new Transaction()
    const mockTransactionRepository: ITransactionRepository = {
        createAndSave({}){
            return Promise.resolve(transaction)
        }
    }

    beforeEach(() => {
        accountService = new AccountService(mockAccountRepository, mockTransactionRepository)
    })

    it('Should get balance fromm repo', async () => {
        const findOneSpy = jest.spyOn(mockAccountRepository, 'findOne')
        await accountService.getBalance('sample')

        expect(findOneSpy).toHaveBeenCalled()
        expect(findOneSpy).toHaveBeenCalledWith({
            where: {
                userId: 'sample'
            }
        })
    })

    it('SHould get balance fromm repo', async () => {
        const findOneSpy = jest.spyOn(mockAccountRepository, 'findOne').mockImplementation(() => Promise.resolve(undefined))
        try{
            await accountService.getBalance('sample')
        } catch(err){
            expect(err).toBeInstanceOf(NotFoundError)
            expect(findOneSpy).toHaveBeenCalled()
        }
    })
    
})