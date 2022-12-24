import { Router } from 'express';
import { authController } from '@/controller';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/authorizeCustomer', authController.authorizeCustomer);
router.post('/verifyPhone', authController.verifyPhone);
router.post('/register', authController.register);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/verifyEmail', authController.verifyEmail);

export default router;
