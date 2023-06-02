import { Router } from 'express';
import {
  authController,
  userController,
  locationController,
  assetController,
  pointController,
  productController,
  rewardController,
  activityController,
  configController,
  tabletController,
  transactionController,
  emailTemplateController,
  userLocationController
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
  '/gallery/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  assetController.updateGallery
);
router.delete(
  '/gallery/:id',
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
  '/rewards',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.filter
);

router.get(
  '/rewards/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.getOne
);

router.get(
  '/reward/items',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.getRewards
);

router.get(
  '/rewards/user/:userId',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  rewardController.getByUserId
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

router.get(
  '/activities',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  activityController.filter
);

router.delete(
  '/activity/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  activityController.deleteActivity
);

router.get(
  '/configs',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  configController.getConfig
);

router.post(
  '/configs',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  configController.createConfig
);
router.get(
  '/tablets',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  tabletController.getTablets
);

router.post(
  '/tablet',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  tabletController.createTablet
);

router.put(
  '/tablet',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  tabletController.updateTablet
);
router.delete(
  '/tablet/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  tabletController.deleteTablet
);

router.post(
  '/tablet/password',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  tabletController.changePasswordTablet
);

router.get(
  '/transactions',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  transactionController.getTransactions
);
router.get(
  '/transactions/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  transactionController.getTransaction
);
router.post(
  '/transaction',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  transactionController.createTransaction
);
router.put(
  '/transaction/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  transactionController.updateTransaction
);
router.delete(
  '/transaction/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  transactionController.deleteTransaction
);

router.get(
  '/email_templates',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.getEmailTemplates
);

router.get(
  '/email_template/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.getEmailTemplateById
);

router.post(
  '/email_template',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.saveEmailTemplate
);

router.delete(
  '/email_template/:id',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.deleteEmailTemplate
);

router.post(
  '/send_test_email',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.sendTestEmail
);

router.get(
  '/sendinblue/email_templates',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.getSendinBlueEmailTemplates
);

router.post(
  '/send_campaign_email',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.sendCampaignEmail
);

router.post(
  '/followup_email',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  emailTemplateController.followUpEmail
);

router.get(
  '/user_locations',
  securityHelper.JwtAuth.authenticate('jwt', { session: false }),
  userLocationController.filter
);

export default router;
