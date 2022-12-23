import { Router } from 'express';
import { authController } from '@/controller';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/authorizeCustomer', authController.authorizeCustomer);
router.post('/verifyPhone', authController.verifyPhone);

export default router;
