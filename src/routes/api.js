import { Router } from 'express';
import { authController, userController, locationController, assetController } from '@/controller';
import { securityHelper } from '@/helpers';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/refreshToken', authController.refreshToken);
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
router.post(
  '/roles',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getRoles
);
router.post(
  '/users',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getUsers
);
router.post(
  '/user',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getUser
);
router.post(
  '/password',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updatePassword
);
router.post(
  '/updateUser',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updateUser
);
router.post(
  '/deleteUser',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.deleteUser
);

router.post(
  '/locations',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.getLocations
);
router.post(
  '/location',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.getLocation
);
router.post(
  '/createLocation',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.createLocation
);
router.post(
  '/updateLocation',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.updateLocation
);
router.post(
  '/deleteLocation',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.deleteLocation
);
router.post(
  '/createUploadForm',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createUploadForm
);
router.post(
  '/createAsset',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createAsset
);
router.post(
  '/createGallery',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.createGallery
);

export default router;
