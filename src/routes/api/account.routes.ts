import { Router } from 'express'
import AccountRepository from '../../repositories/account.repository'
import AccountController from '../../controllers/account.controller'
import { auth } from '../../middlewares/auth'
import { getConnection } from 'typeorm'
import AccountService from '../../services/account.services'
import TransactionRepository from '../../repositories/transaction.repository'
import validateRequest from '../../middlewares/validator'
import {
    fundAccountBody,
    makeTransferBodySchema,
} from '../../schemas/account.schema'
import PaymentService from '../../services/payment.service'
import BeneficiaryRepository from '../../repositories/beneficiary.repository'

const accountsRouter: Router = Router()
const accountRouter: Router = Router()

const accountRepository =
    getConnection('q-wallet').getCustomRepository(AccountRepository)
const transactionRepository = getConnection('q-wallet').getCustomRepository(
    TransactionRepository
)
const beneficiaryRepository = getConnection('q-wallet').getCustomRepository(
    BeneficiaryRepository
)
const paymentService = new PaymentService()

const accountService = new AccountService(
    accountRepository,
    transactionRepository,
    paymentService,
    beneficiaryRepository
)

const accountController = AccountController(accountService)
accountRouter.post(
    '/transfer',
    auth,
    validateRequest(makeTransferBodySchema),
    accountController.makeTransfer
)
accountRouter.get('/balance', auth, accountController.getBalance)
accountRouter.post(
    '/fund',
    auth,
    validateRequest(fundAccountBody),
    accountController.fundAccount
)

accountRouter.post('/withdraw', auth, accountController.withdraw)
// // router.get('/:userId', userController.getUser);
// accountRouter.post('/fund', auth, accountController.initiateCardFunding);
// accountRouter.post('/fund/validate', auth, accountController.validateFunding);

export { accountRouter, accountsRouter }
