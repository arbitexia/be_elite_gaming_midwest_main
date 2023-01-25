import { Router } from 'express';
import { authController, userController, locationController, assetController } from '@/controller';
import { securityHelper } from '@/helpers';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/refresh', authController.refreshToken);
router.post('/authorize_tablet', authController.authorizeTablet);
router.post('/authorize_customer', authController.authorizeCustomer);
router.post('/verify_phone', authController.verifyPhone);
router.post('/register', authController.register);
router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password', authController.resetPassword);
router.post('/verify_email', authController.verifyEmail);
router.post(
  '/tablet/authorize',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.authorizeCustomer
);
router.post(
  '/tablet/verify_phone',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.verifyPhone
);
router.post(
  '/tablet/register',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  authController.register
);
router.get(
  '/roles',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getRoles
);
router.get(
  '/users',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getUsers
);
router.get(
  '/user/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getUser
);
router.post(
  '/password',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updatePassword
);
router.put(
  '/user',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updateUser
);
router.delete(
  '/user/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.deleteUser
);

router.get(
  '/locations',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.getLocations
);
router.get(
  '/location/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.getLocation
);
router.post(
  '/location',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.createLocation
);
router.put(
  '/location/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.updateLocation
);
router.delete(
  '/location/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.deleteLocation
);
router.post(
  '/new_upload_form',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createUploadForm
);
router.post(
  '/asset',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createAsset
);
router.post(
  '/gallery',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createGallery
);

export default router;
