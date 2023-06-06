import {
  APP_MESSAGE,
  DEFAULT_INC_POINT,
  EMAIL_TEMPLATE_CATEGORY,
  EMAIL_TEMPLATE_STATUS
} from '@/constants';
import { cursorHelper, fractionateHelper, securityHelper } from '@/helpers';
import { EmailTemplate, User, UserLocation } from '@/models';
import { SendEmailSendinBlue } from '@/helpers/sendInBlue';

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

export const saveEmailTemplate = async ({ id, name, status, type, category, templateId }) => {
  let emailTemplate;
  if (id > 0) {
    const retEmailTemplate = await EmailTemplate.query().findOne({ id }).throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND,
      type: 'NOT_FOUND'
    });
    emailTemplate = await retEmailTemplate.$query().updateAndFetch({
      name,
      templateId,
      status,
      category
    });
  } else {
    emailTemplate = await EmailTemplate.query().insertAndFetch({
      name,
      templateId,
      status,
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
export const requestTransactionEmail = async ({ user, templateId, transaction }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query().findOne({
      category: EMAIL_TEMPLATE_CATEGORY.REQUEST_TRANSACTION,
      status: EMAIL_TEMPLATE_STATUS.PUBLISHED
    });
    if (template) {
      await SendEmailSendinBlue({
        email: user.email,
        name: user.firstName,
        templateId: template.templateId
      });
    }
  }
};

export const acceptTransactionEmail = async ({ user, templateId, transaction }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query().findOne({
      category: EMAIL_TEMPLATE_CATEGORY.ACCEPT_TRANSACTION,
      status: EMAIL_TEMPLATE_STATUS.PUBLISHED
    });
    if (template) {
      await SendEmailSendinBlue({
        email: user.email,
        name: user.firstName,
        templateId: template.templateId
      });
    }
  }
};

export const declineTransactionEmail = async ({ user, templateId, transaction }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query().findOne({
      category: EMAIL_TEMPLATE_CATEGORY.DECLINE_TRANSACTION,
      status: EMAIL_TEMPLATE_STATUS.PUBLISHED
    });
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId: template.templateId
    });
  }
};

export const addPointEmail = async ({ user, templateId, dailyConfig, point }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId,
      pointInfo: { point: dailyConfig, totalPoint: point?.totalPoint ?? dailyConfig }
    });
  } else {
    const template = await EmailTemplate.query().findOne({
      category: EMAIL_TEMPLATE_CATEGORY.ADD_POINT,
      status: EMAIL_TEMPLATE_STATUS.PUBLISHED
    });
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId: template.templateId,
      pointInfo: { point: dailyConfig, totalPoint: point?.totalPoint ?? dailyConfig }
    });
  }
};

export const confirmUserRegisterEmail = async ({ user, templateId }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query()
      .findOne({
        category: EMAIL_TEMPLATE_CATEGORY.CONFIRM_USER_REGISTER,
        status: EMAIL_TEMPLATE_STATUS.PUBLISHED
      })
      .throwIfNotFound({
        message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
      });

    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId: template.templateId
    });
  }
};

export const forgotPasswordEmail = async ({ user, templateId, token }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      token: '1234',
      templateId
    });
  } else {
    const template = await EmailTemplate.query()
      .findOne({
        category: EMAIL_TEMPLATE_CATEGORY.VERIFY_FORGOT_PASSWORD,
        status: EMAIL_TEMPLATE_STATUS.PUBLISHED
      })
      .throwIfNotFound({
        message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
      });
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      token,
      templateId: template.templateId
    });
  }
};

export const resetPasswordEmail = async ({ user, templateId, updatedUser }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query()
      .findOne({
        category: EMAIL_TEMPLATE_CATEGORY.CONFIRM_RESET_PASSWORD,
        status: EMAIL_TEMPLATE_STATUS.PUBLISHED
      })
      .throwIfNotFound({
        message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
      });
    if (template) {
      await SendEmailSendinBlue({
        email: user.email,
        name: user.firstName,
        templateId: template.templateId
      });
    }
  }
};

export const forceResetPasswordEmail = async ({ user, templateId, randomPassword }) => {
  if (templateId) {
    await SendEmailSendinBlue({
      email: user.email,
      name: user.firstName,
      templateId
    });
  } else {
    const template = await EmailTemplate.query()
      .findOne({
        category: EMAIL_TEMPLATE_CATEGORY.FORCE_RESET_PASSWORD,
        status: EMAIL_TEMPLATE_STATUS.PUBLISHED
      })
      .throwIfNotFound({
        message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
      });
    if (template) {
      await SendEmailSendinBlue({
        email: user.email,
        name: user.firstName,
        templateId: template.templateId,
        tempPassword: randomPassword
      });
    }
  }
};

export const testEmail = async ({ id, toEmail, user }) => {
  const template = await EmailTemplate.query().findById(id).throwIfNotFound({
    message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
  });
  const testUser = { ...user, email: toEmail };
  switch (template.category) {
    case EMAIL_TEMPLATE_CATEGORY.REQUEST_TRANSACTION:
      await requestTransactionEmail({ user: testUser, templateId: template.templateId });
      break;
    case EMAIL_TEMPLATE_CATEGORY.ACCEPT_TRANSACTION:
      await acceptTransactionEmail({ user: testUser, templateId: template.templateId });
      break;
    case EMAIL_TEMPLATE_CATEGORY.DECLINE_TRANSACTION:
      await declineTransactionEmail({ user: testUser, templateId: template.templateId });
      break;
    case EMAIL_TEMPLATE_CATEGORY.ADD_POINT:
      await addPointEmail({
        user: testUser,
        templateId: template.templateId,
        dailyConfig: DEFAULT_INC_POINT,
        point: { totalPoint: 1000, id: 1 }
      });
      break;
    case EMAIL_TEMPLATE_CATEGORY.CONFIRM_USER_REGISTER:
      await confirmUserRegisterEmail({ user: testUser, templateId: template.templateId });
      break;
    case EMAIL_TEMPLATE_CATEGORY.VERIFY_FORGOT_PASSWORD:
      await forgotPasswordEmail({ user: testUser, templateId: template.templateId });
      break;
    case EMAIL_TEMPLATE_CATEGORY.CONFIRM_RESET_PASSWORD:
      await resetPasswordEmail({
        user: testUser,
        templateId: template.templateId,
        updatedUser: testUser
      });
      break;
    case EMAIL_TEMPLATE_CATEGORY.FORCE_RESET_PASSWORD:
      const randomPassword = securityHelper.genRandomTokenString(16);
      await forceResetPasswordEmail({
        user: testUser,
        templateId: template.templateId,
        randomPassword
      });
      break;
    default:
      break;
  }
  return { message: 'Sent the email' };
};

export const sendEmails = async ({ locationId, templateId, customerIds }) => {
  if (customerIds) {
    const users = await User.query().whereIn('id', customerIds);
    if (users.length > 0) {
      await Promise.all(
        users.map(async (user) => {
          await SendEmailSendinBlue({
            email: user.email,
            name: user.firstName,
            templateId
          });
        })
      );
    }
  } else {
    const userLocation = await UserLocation.query()
      .where({ locationId })
      .withGraphFetched('[user]');
    if (userLocation.length > 0) {
      await Promise.all(
        userLocation.map(async ({ user }) => {
          console.log(user.email);
          await SendEmailSendinBlue({
            email: user.email,
            name: user.firstName,
            templateId
          });
        })
      );
    } else {
      return APP_MESSAGE.COMMON.NOT_FOUND;
    }
  }
  return APP_MESSAGE.EMAIL.SEND_SUCCESS;
};
