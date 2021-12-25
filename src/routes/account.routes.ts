import { Router } from 'express';
import accountController from '../controllers/account.controller';
import { auth } from '../middlewares/auth';

const router: Router = Router();

router.post('/transfer', auth, accountController.makeTransfer);
// router.get('/:userId', userController.getUser);

export default router;
