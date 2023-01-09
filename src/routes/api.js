import { Router } from 'express';
import { authController } from '@/controller';
import { securityHelper } from '@/helpers';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/authorizeTablet', authController.authorizeTablet);
router.post('/authorizeCustomer', authController.authorizeCustomer);
router.post('/verifyPhone', authController.verifyPhone);
router.post('/register', authController.register);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/verifyEmail', authController.verifyEmail);
router.post(
  '/tablet/authorizeCustomer',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.authorizeCustomer
);
router.post(
  '/tablet/verifyPhone',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.verifyPhone
);
router.post(
  '/tablet/register',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.register
);

export default router;
