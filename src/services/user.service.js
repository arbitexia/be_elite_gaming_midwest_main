import { User, Role, EmailTemplate } from '@/models';
import { securityHelper, fractionateHelper, placeholderHelper, cursorHelper } from '@/helpers';
import { AWSProvider } from '@/provider';
import { APP_MESSAGE, EMAIL_TEMPLATE_MAPPER } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const loadUsers = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('user', cursor);
  const { filter } = await fractionateHelper('user');

  queryBuilder = filter(filterBy);

  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[role, avatar]');

  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const user = await User.query().findOne({ id }).withGraphFetched('[role, avatar]');
  return user;
};

export const loadRoles = async () => {
  const roles = await Role.query().select('*');
  return roles;
};

export const updateUser = async (id, input) => {
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedUser = await user
    .$query()
    .updateAndFetch({
      ...input
    })
    .withGraphFetched('[role, avatar]');

  return updatedUser;
};

export const deleteUser = async (id) => {
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await user.$query().delete();
  return {
    message: APP_MESSAGE.USER.SUCESS_USER_DELETE
  };
};

export const updatePassword = async (id, oldPassword, password) => {
  const hashedPassword = await securityHelper.hashPassword(password);
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND
  });

  if (!securityHelper.validatePassword(oldPassword, user.password)) {
    throw new UserInputError(APP_MESSAGE.USER.INVALID_PASSWORD);
  }
  await user.$query().updateAndFetch({
    password: hashedPassword
  });

  return {
    message: APP_MESSAGE.USER.SUCESS_PASSWORD_CHANGE
  };
};

export const forceResetPassword = async (id) => {
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND
  });

  const randomPassword = securityHelper.genRandomTokenString(16);
  const hashedPassword = await securityHelper.hashPassword(randomPassword);

  const updatedUser = await user
    .$query()
    .updateAndFetch({
      password: hashedPassword
    })
    .withGraphFetched('[role, avatar]');

  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.FORCE_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  if (!TEST) {
    const { subject, htmlBody } = await placeholderHelper({
      template,
      userInfo: updatedUser,
      tempPassword: randomPassword
    });
    const awsProvider = new AWSProvider();
    await awsProvider.sendEmail(updatedUser.email, subject, htmlBody);
  }

  return updatedUser;
};
