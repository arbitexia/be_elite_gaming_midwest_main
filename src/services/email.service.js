import { APP_MESSAGE, DEFAULT_INC_POINT, EMAIL_TEMPLATE_CATEGORY } from '@/constants';
import { cursorHelper, emailContentHelper, fractionateHelper, securityHelper } from '@/helpers';
import { EmailTemplate } from '@/models';
import { AWSProvider } from '@/provider';
import { hashCodeService } from '.';

export const getEmailTemplates = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('emailTemplate', cursor);
  const { filter } = await fractionateHelper('emailTemplate');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[]');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getEmailTemplateById = async (id) => {
  const emailTemplate = await EmailTemplate.query().findById(id).throwIfNotFound({
    message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return emailTemplate;
};

export const saveEmailTemplate = async ({
  id,
  name,
  subject,
  htmlBody,
  status,
  type,
  category
}) => {
  let emailTemplate;
  if (id > 0) {
    const retEmailTemplate = await EmailTemplate.query().findOne({ id }).throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND,
      type: 'NOT_FOUND'
    });
    emailTemplate = await retEmailTemplate.$query().updateAndFetch({
      name,
      subject,
      htmlBody,
      status,
      type,
      category
    });
  } else {
    emailTemplate = await EmailTemplate.query().insertAndFetch({
      name,
      subject,
      htmlBody,
      status,
      type,
      category
    });
  }

  return emailTemplate;
};

export const deleteEmailTemplate = async (id) => {
  const emailTemplate = await EmailTemplate.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await emailTemplate.$query().delete();
  return {
    message: APP_MESSAGE.EMAIL_TEMPLATE.SUCCESS_DELETE
  };
};

//send email
export const requestTransactionEmail = async ({ user, transaction }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query().findOne({
    category: EMAIL_TEMPLATE_CATEGORY.REQUEST_TRANSACTION
  });
  if (template) {
    const { subject, htmlBody } = await emailContentHelper({
      template,
      hashCodes,
      userInfo: user
    });
    const awsProvider = new AWSProvider();
    await awsProvider.sendEmail(user.email, subject, htmlBody);
  }
};

export const acceptTransactionEmail = async ({ user, transaction }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query().findOne({
    category: EMAIL_TEMPLATE_CATEGORY.ACCEPT_TRANSACTION
  });
  const { subject, htmlBody } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const declineTransactionEmail = async ({ user, transaction }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query().findOne({
    category: EMAIL_TEMPLATE_CATEGORY.DECLINE_TRANSACTION
  });
  const { subject, htmlBody } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const addPointEmail = async ({ user, dailyConfig, point }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query().findOne({
    category: EMAIL_TEMPLATE_CATEGORY.ADD_POINT
  });
  const { subject, htmlBody } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: user,
    pointInfo: { point: dailyConfig, totalPoint: point?.totalPoint ?? dailyConfig }
  });
  try {
    const awsProvider = new AWSProvider();
    await awsProvider.sendEmail(user.email, subject, htmlBody);
  } finally {
  }
};

export const confirmUserRegisterEmail = async (user) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query()
    .findOne({
      category: EMAIL_TEMPLATE_CATEGORY.CONFIRM_USER_REGISTER
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, htmlBody } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: user
  });

  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const forgotPasswordEmail = async (user) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query()
    .findOne({
      category: EMAIL_TEMPLATE_CATEGORY.VERIFY_FORGOT_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, htmlBody, token } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: user
  });

  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const resetPasswordEmail = async ({ user, updatedUser }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query()
    .findOne({
      category: EMAIL_TEMPLATE_CATEGORY.CONFIRM_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, htmlBody } = await emailContentHelper({
    template,
    hashCodes,
    userInfo: updatedUser
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const forceResetPasswordEmail = async ({ user, randomPassword }) => {
  const hashCodes = await hashCodeService.getHashCodes();
  const template = await EmailTemplate.query()
    .findOne({
      category: EMAIL_TEMPLATE_CATEGORY.FORCE_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });
  // if (!TEST) {
  const { subject, htmlBody } = await emailContentHelper({
    template,
    userInfo: user,
    hashCodes,
    tempPassword: randomPassword
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
  // }
};

export const testEmail = async ({ id, toEmail, user }) => {
  const template = await EmailTemplate.query().findById(id).throwIfNotFound({
    message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
  });
  const testUser = { ...user, email: toEmail };
  switch (template.category) {
    case EMAIL_TEMPLATE_CATEGORY.REQUEST_TRANSACTION:
      await requestTransactionEmail({ user: testUser });
      break;
    case EMAIL_TEMPLATE_CATEGORY.ACCEPT_TRANSACTION:
      await acceptTransactionEmail({ user: testUser });
      break;
    case EMAIL_TEMPLATE_CATEGORY.DECLINE_TRANSACTION:
      await declineTransactionEmail({ user: testUser });
      break;
    case EMAIL_TEMPLATE_CATEGORY.ADD_POINT:
      await addPointEmail({
        user,
        dailyConfig: DEFAULT_INC_POINT,
        point: { totalPoint: 1000, id: 1 }
      });
      break;
    case EMAIL_TEMPLATE_CATEGORY.CONFIRM_USER_REGISTER:
      await confirmUserRegisterEmail(testUser);
      break;
    case EMAIL_TEMPLATE_CATEGORY.VERIFY_FORGOT_PASSWORD:
      await forgotPasswordEmail(testUser);
      break;
    case EMAIL_TEMPLATE_CATEGORY.CONFIRM_RESET_PASSWORD:
      await resetPasswordEmail({ user: testUser, updatedUser: testUser });
      break;
    case EMAIL_TEMPLATE_CATEGORY.FORCE_RESET_PASSWORD:
      const randomPassword = securityHelper.genRandomTokenString(16);
      await forceResetPasswordEmail({ user: testUser, randomPassword });
      break;
    default:
      break;
  }
  return { message: 'Sent the email' };
};
