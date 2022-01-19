import { Router } from 'express';
import accountController from '../controllers/account.controller';
import { auth } from '../middlewares/auth';

export const accountsRouter: Router = Router();
export const accountRouter: Router = Router();

accountRouter.post('/transfer', auth, accountController.makeTransfer);
accountRouter.get('/balance', auth, accountController.getBalance);
// router.get('/:userId', userController.getUser);
accountRouter.post('/fund', auth, accountController.initiateCardFunding);
accountRouter.post('/fund/validate', auth, accountController.validateFunding);
