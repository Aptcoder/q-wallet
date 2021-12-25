import { Router } from 'express';
import userController from '../controllers/user.controller';

const router: Router = Router();

router.post('/', userController.create);
router.get('/:userId', userController.getUser);
router.post('/auth', userController.authUser);

export default router;
