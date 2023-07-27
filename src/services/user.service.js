import { User, Role, Activity, UserLocation, Point, Transaction, UserCoupon } from '@/models';
import { securityHelper, fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE, USER_ROLE_MAPPER } from '@/constants';
import config from '@/config';
import { emailService } from '.';

const TEST = config.NODE_ENV === 'test';

export const loadUsers = async (filterBy, cursor, userId) => {
  let queryBuilder;
  const pageCursor = cursorHelper('user', cursor);
  const { filter } = await fractionateHelper('user');

  queryBuilder = filter(filterBy, userId);

  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[role, avatar, userLocations, userCoupons]');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const user = await User.query()
    .findOne({ id })
    .withGraphFetched('[role, avatar, userLocations, userCoupons]');
  return user;
};

export const loadRoles = async () => {
  const roles = await Role.query().select('*');
  return roles;
};

export const updateUser = async (id, input) => {
  const {
    firstName,
    lastName,
    birthday,
    email,
    firstLogin,
    status,
    userName,
    roleId,
    avatar,
    phone
  } = input;
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  let hashedPassword;
  if (roleId === USER_ROLE_MAPPER.ADMIN && roleId !== user.roleId) {
    hashedPassword = await securityHelper.hashPassword(`${userName}${phone}`);
  }

  const updatedUser = await user
    .$query()
    .updateAndFetch({
      firstName,
      lastName,
      email,
      birthday,
      firstLogin: firstLogin ?? undefined,
      status,
      roleId,
      assetId: avatar?.id ?? undefined,
      userName,
      ...(hashedPassword && { password: hashedPassword })
    })
    .withGraphFetched('[role, avatar, userCoupons]');

  return updatedUser;
};

export const deleteUser = async (id) => {
  const user = await User.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  //delete activity
  await Activity.query().delete().where('user_id', '=', user.id);
  //delete transaction
  await Transaction.query().delete().where('user_id', '=', user.id);
  //delete user_location
  const userLocation = await UserLocation.query().where('user_id', '=', user.id);
  //delete user_coupon
  await UserCoupon.query().delete().where('user_id', '=', user.id);
  await Point.query()
    .delete()
    .whereIn(
      'userLocationId',
      userLocation.map((obj) => {
        return obj.id;
      })
    );
  await UserLocation.query().delete().where('user_id', '=', user.id);
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
  await emailService.forceResetPasswordEmail({ user: updatedUser, randomPassword });
  return updatedUser;
};
