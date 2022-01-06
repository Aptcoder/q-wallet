import { Router } from 'express';
import accountController from '../controllers/account.controller';
import { auth } from '../middlewares/auth';

const router: Router = Router();

router.post('/transfer', auth, accountController.makeTransfer);
// router.get('/:userId', userController.getUser);
router.post('/fund_with_card', auth, accountController.initiateCardFunding);
router.post('/fund_with_card/validate', auth, accountController.validateFunding);

export default router;
