import { Router } from 'express'
import { getConnection } from 'typeorm'
import validateRequest from '../../middlewares/validator'
import BeneficiaryRepository from '../../repositories/beneficiary.repository'
import BeneficiaryService from '../../services/beneficiary.service'
import PaymentService from '../../services/payment.service'
import BeneficiaryController from '../../controllers/beneficiary.controller'
import { createBeneficiaryBodySchema } from '../../schemas/beneficiary.schema'
import { auth } from '../../middlewares/auth'
const beneficiaryRepository = getConnection('q-wallet').getCustomRepository(
    BeneficiaryRepository
)
const paymentService = new PaymentService()
const beneficiaryService = new BeneficiaryService(
    beneficiaryRepository,
    paymentService
)
const beneficiaryRouter: Router = Router()

const beneficiaryController = BeneficiaryController(beneficiaryService)

beneficiaryRouter.post(
    '/',
    auth,
    validateRequest(createBeneficiaryBodySchema),
    beneficiaryController.create
)
// router.get('/:userId', userController.getUser);
export default beneficiaryRouter
