import { APP_MESSAGE, EMAIL_TEMPLATE_MAPPER } from '@/constants';
import { cursorHelper, emailContentHelper, fractionateHelper, placeholderHelper } from '@/helpers';
import { EmailTemplate, HashCode, User } from '@/models';
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

export const saveEmailTemplate = async ({ id, name, subject, htmlBody, status, type }) => {
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
      type
    });
  } else {
    emailTemplate = await EmailTemplate.query().insertAndFetch({
      name,
      subject,
      htmlBody,
      status,
      type
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

export const requestTransactionEmail = async ({ user, transaction }) => {
  const template = await EmailTemplate.query().findOne({
    useFor: EMAIL_TEMPLATE_MAPPER.REQUEST_TRANSACTION_EMAIL
  });
  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const acceptTransactionEmail = async (user, transaction) => {
  const template = await EmailTemplate.query().findOne({
    useFor: EMAIL_TEMPLATE_MAPPER.ACCEPT_TRANSACTION_EMAIL
  });
  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const declineTransactionEmail = async (user, transaction) => {
  const template = await EmailTemplate.query().findOne({
    useFor: EMAIL_TEMPLATE_MAPPER.ACCEPT_TRANSACTION_EMAIL
  });
  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const addPointEmail = async ({ user, dailyConfig, point }) => {
  const template = await EmailTemplate.query().findOne({
    useFor: EMAIL_TEMPLATE_MAPPER.ADD_POINT_EMAIL
  });
  const { subject, htmlBody } = await placeholderHelper({
    template,
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
  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.CONFIRM_EMAIL_USER_REGISTER
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: user
  });

  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const forgotPasswordEmail = async (user) => {
  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.VERIFY_EMAIL_FORGOT_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });
  const { subject, htmlBody, token } = await placeholderHelper({
    template,
    userInfo: user
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const resetPasswordEmail = async ({ user, updatedUser }) => {
  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.CONFIRM_EMAIL_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: updatedUser
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
};

export const forceResetPasswordEmail = async ({ user, randomPassword }) => {
  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.FORCE_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });
  // if (!TEST) {
  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: user,
    tempPassword: randomPassword
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);
  // }
};

export const testEmail = async () => {
  const hashCodes = await hashCodeService.getHashCodes();
  const user = await User.query().findOne({ id: 1 }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND
  });

  const template = await EmailTemplate.query()
    .findOne({
      name: 'Welcome Message'
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const { subject, emailContent } = await emailContentHelper({
    hashCodes,
    template,
    userInfo: user,
    tempPassword: 'randomPassword'
  });
  // console.log(htmlBody);
  // const awsProvider = new AWSProvider();
  // // await awsProvider.sendEmail(user.email, subject, htmlBody);
  return { message: 'Success', body: emailContent };
};
