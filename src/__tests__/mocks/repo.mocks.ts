import Transaction from '../../entities/transaction.entity'
import Account from '../../entities/account.entity'
import {
    IAccountRepository,
    IBeneficiaryRepository,
    ITransactionRepository,
    IUserRepository,
} from '../../utils/interfaces/repos.interfaces'
import User from 'src/entities/user.entity'

const account = new Account()

export const mockAccountRepository: IAccountRepository = {
    findOne({}) {
        return Promise.resolve(account)
    },
    update({}) {},
    findByUserId(userId: string) {
        return Promise.resolve(account)
    },
    updateBalance(account, amount, inc): Promise<Account> {
        return Promise.resolve(account)
    },
}

const transaction = new Transaction()
export const mockTransactionRepository: ITransactionRepository = {
    createAndSave({}) {
        return Promise.resolve(transaction)
    },
}

export const mockBeneficiaryRepository: IBeneficiaryRepository = {
    findByUserId() {
        return Promise.resolve([])
    },

    createAndSave() {
        return Promise.resolve({})
    },

    findOneWithUserId() {
        return Promise.resolve({
            bank_account: '',
            bank_code: '044',
        })
    },
}

const sample_user = {
    email: 'sample@gmail.com',
    firstName: 'Sample',
    lastName: 'Gmail',
    phoneNumber: '',
    password: 'samplepassword',
}
const user = new User()
export const mockUserRepository: IUserRepository = {
    create() {
        return user
    },
    findByEmail() {
        console.log('called')
        return Promise.resolve(user)
    },
    save() {
        return Promise.resolve(user)
    },
}
