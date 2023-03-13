import { Router } from 'express';
import {
  authController,
  awardController,
  userController,
  locationController,
  assetController,
  pointController,
  productController,
  rewardController
} from '@/controller';
import { securityHelper, ipMiddleware } from '@/helpers';

const router = Router();
router.post('/authorize', authController.authorize);
router.post('/refresh', authController.refreshToken);
router.post('/authorize_tablet', authController.authorizeTablet);
router.post('/authorize_customer_from_tablet', authController.authorizeCustomerFromTablet);
router.post('/authorize_customer', authController.authorizeCustomer);
router.post('/verify_phone', authController.verifyPhone);
router.post('/register', ipMiddleware, authController.register);
router.post('/create_new_user', authController.createNewUser);
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
  '/users/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.getUser
);
router.post(
  '/password',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updatePassword
);
router.put(
  '/users',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.updateUser
);
router.delete(
  '/users/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userController.deleteUser
);

router.get(
  '/locations',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.filter
);
router.get(
  '/locations/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.getOne
);
router.post(
  '/locations',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.create
);
router.put(
  '/locations/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.update
);
router.delete(
  '/locations/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  locationController.destroy
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
router.put(
  '/gallery',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.updateGallery
);
router.delete(
  '/gallery',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.deleteGallery
);

router.get(
  '/points',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  pointController.getPoints
);
router.get(
  '/points/:userId/:locationId',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  pointController.getPoint
);

router.get(
  '/products',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  productController.getProducts
);
router.get(
  '/products/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  productController.getProduct
);
router.post(
  '/products',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  productController.createProduct
);
router.put(
  '/products/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  productController.updateProduct
);
router.delete(
  '/products/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  productController.deleteProduct
);

router.get(
  '/awards',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  awardController.getAwards
);
router.get(
  '/awards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  awardController.getAward
);
router.post(
  '/awards',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  awardController.createAward
);
router.put(
  '/awards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  awardController.acceptAward
);
router.delete(
  '/awards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  awardController.declineAward
);
router.get(
  '/rewards',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.filter
);
router.get(
  '/rewards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.getOne
);
router.post(
  '/rewards',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.create
);
router.put(
  '/rewards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.update
);
router.delete(
  '/rewards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.destroy
);

export default router;
