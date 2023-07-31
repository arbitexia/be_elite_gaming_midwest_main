import {
  User,
  Verification,
  Point,
  Config,
  Tablet,
  UserLocation,
  BackOffice,
  UserCoupon
} from '@/models';
import { dateHelper, securityHelper, twilioHelper } from '@/helpers';
import {
  APP_MESSAGE,
  USER_STATUS_MAPPER,
  USER_ROLE_MAPPER,
  VERIFICATION_TYPE_MAPPER,
  VERIFICATION_STATUS_MAPPER,
  DEFAULT_COUPON,
  ACTIVITY_MODEL,
  ACTIVITY_TYPE,
  STATUS_MSG,
  DEFAULT_INC_POINT,
  TEST_PHONE_NUMBER,
  USER_COUPON_STATUS,
  BACK_OFFICE_STATUS
} from '@/constants';
import { BadRequest } from '@/provider/error';
import config from '@/config';
import { formatDistanceStrict } from 'date-fns';
import { activityService, emailService, pointService, userLocationService } from '@/services';
import { campaignWorkerEmail } from './email.service';
import uniqid from 'uniqid';

export const refreshToken = async (refreshToken, res) => {
  const refreshDecoded = await securityHelper.decodeJwtToken(refreshToken);
  const userId = refreshDecoded.userId;
  const isTablet = refreshDecoded?.isTablet;
  const newToken = await securityHelper.genJwtToken(userId, '8h');
  return { accessToken: newToken, userId, isTablet };
};

export const createNewUser = async (param) => {
  const user = await User.query().findOne({ email: param.email });
  if (user) throw new BadRequest(APP_MESSAGE.AUTH.DUPLICATED_EMAIL);

  const {
    firstName,
    lastName,
    userName,
    email,
    address,
    phone,
    birthday,
    roleId,
    avatar,
    locationId
  } = param;

  if (locationId <= 0) {
    throw new BadRequest('Select a location');
  }
  let hashedPassword;
  if (roleId === USER_ROLE_MAPPER.ADMIN) {
    hashedPassword = await securityHelper.hashPassword(`${userName}${phone}`);
  }
  const configItem = await Config.query().first();
  const newUser = await User.query()
    .insertAndFetch({
      firstName,
      lastName,
      userName,
      email,
      location: address,
      phone,
      ...(birthday && { birthday }),
      status: USER_STATUS_MAPPER.ACTIVATED,
      roleId,
      assetId: avatar?.id ?? undefined,
      coupon: configItem ? configItem.initialCoupon : DEFAULT_COUPON,
      ...(hashedPassword && { password: hashedPassword })
    })
    .withGraphFetched('[role, avatar, userCoupons]');

  await UserLocation.query().insert({
    userId: newUser.id,
    locationId: locationId
  });

  return newUser;
};

export const register = async (phone, email, birthday, locationInfo) => {
  const user = await User.query().findOne({
    phone,
    roleId: USER_ROLE_MAPPER.USER
  });

  if (user) {
    // const verification = await Verification.query().where({
    //   victimId: user.id,
    //   status: VERIFICATION_STATUS_MAPPER.ACTIVATED
    // });
    throw new BadRequest(APP_MESSAGE.AUTH.DUPLICATED_PHONE);
  }

  const configItem = await Config.query().first();
  const token = securityHelper.genPhoneVerifyToken().toString();
  const isTester = TEST_PHONE_NUMBER.some((number) => phone.includes(number));
  if (!isTester) {
    await twilioHelper.SendTextSms({
      body: `${token}`,
      to: phone
    });
    await twilioHelper.SendTextSms({
      body: `You got coupons $${configItem ? configItem.initialCoupon : DEFAULT_COUPON} today.`,
      to: phone
    });
  }

  const newUser = await User.query()
    .insertAndFetch({
      phone,
      email,
      birthday,
      roleId: USER_ROLE_MAPPER.USER,
      firstLogin: locationInfo,
      status: USER_STATUS_MAPPER.VERIFY_PHONE
    })
    .withGraphFetched('[role, avatar,userCoupons]');

  await UserCoupon.query().insert({
    userId: newUser.id,
    amount: configItem ? configItem.initialCoupon : DEFAULT_COUPON,
    code: uniqid('eg-'),
    type: 'FREE',
    expirationDate: dateHelper.addDateTime({ days: 10 }).toISOString(),
    status: USER_COUPON_STATUS.request,
    metadata: {
      desc: 'Signup',
      type: 'FREE',
      coupon: configItem ? configItem.initialCoupon : DEFAULT_COUPON,
      date: new Date().toISOString()
    }
  });

  const updatedUser = await newUser
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });

  await campaignWorkerEmail({
    user: newUser,
    jobInfo: {
      amount: newUser.coupon,
      campaignType: 'WELCOME'
    }
  });
  return {
    message: `${APP_MESSAGE.AUTH.SEND_REGISTER_VERIFY} ${isTester ? `Token: ${token}` : ''}`,
    token,
    userId: updatedUser.id
  };
};

export const authorizeTablet = async (identifier, password, res) => {
  const tablet = await Tablet.query()
    .findOne({ name: identifier, status: USER_STATUS_MAPPER.ACTIVATED })
    .withGraphFetched('[location]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });
  const isValidated = await securityHelper.validatePassword(password, tablet.password);
  if (!isValidated) {
    throw new BadRequest(APP_MESSAGE.AUTH.INVALID_CREDENTIAL);
  }

  const accessToken = await securityHelper.genJwtToken(tablet.id, '24h', true);
  const refreshToken = await securityHelper.genRefreshToken(tablet.id, '24h', true);

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);
  return {
    ...tablet,
    accessToken,
    refreshToken
  };
};

export const authorize = async (identifier, password, res) => {
  const user = await User.query()
    .findOne({
      userName: identifier,
      status: USER_STATUS_MAPPER.ACTIVATED
    })
    .where((builder) => {
      builder.where('roleId', USER_ROLE_MAPPER.ADMIN).orWhere('roleId', USER_ROLE_MAPPER.SUPER);
    })
    .withGraphFetched('[role, avatar, userLocations]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });

  const isValidated = await securityHelper.validatePassword(password, user.password);
  if (!isValidated) {
    throw new BadRequest(APP_MESSAGE.AUTH.INVALID_CREDENTIAL);
  }

  const accessToken = await securityHelper.genJwtToken(user.id, '8h');
  const refreshToken = await securityHelper.genRefreshToken(user.id, '24h');

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);
  const { role, ...rest } = user;

  return {
    user: rest,
    role,
    accessToken,
    refreshToken
  };
};

export const authorizeCustomer = async (identifier, res) => {
  const user = await User.query()
    .findOne({
      phone: identifier,
      roleId: USER_ROLE_MAPPER.USER
    })
    .withGraphFetched('[role, avatar, userCoupons]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });
  const token = securityHelper.genPhoneVerifyToken().toString();
  const isTester = TEST_PHONE_NUMBER.some((number) => identifier.includes(number));
  if (!isTester) {
    await twilioHelper.SendTextSms({
      body: `${token}`,
      to: user.phone
    });
  }
  const updatedUser = await user
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });
  return {
    message: `${APP_MESSAGE.AUTH.SEND_AUTH_VERIFY} ${isTester ? `Token: ${token}` : ''}`,
    token,
    userId: user.id
  };
};

export const authorizeCustomerFromTablet = async (identifier, locationId, res) => {
  const user = await User.query()
    .findOne({
      phone: identifier,
      roleId: USER_ROLE_MAPPER.USER
      // status: USER_STATUS_MAPPER.ACTIVATED
    })
    .withGraphFetched('[role, avatar, userCoupons]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });

  const accessToken = await securityHelper.genJwtToken(user.id, '8h');
  const refreshToken = await securityHelper.genRefreshToken(user.id, '24h');

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);

  const configItem = await Config.query().first();
  const dailyConfig = configItem?.daily ?? DEFAULT_INC_POINT;
  const userLocation = await userLocationService.checkIn(locationId, user.id);
  if (userLocation) {
    const point = await Point.query().findOne({ userLocationId: userLocation.id });
    if (point?.updatedAt) {
      //increase point once a day when use checkin
      const distance = formatDistanceStrict(new Date(), point.updatedAt, { unit: 'day' }).split(
        ' '
      )[0];
      if (Number(distance) > 0) {
        const pointResult = await pointService.addPoint(userLocation.id, dailyConfig);
        //TODO add point activity
        const activityToSave = {
          userId: user.id,
          victimId: point.id,
          model: ACTIVITY_MODEL.POINT,
          type: ACTIVITY_TYPE.UPDATE,
          metadata: { body: { ...userLocation, dailyConfig }, status: STATUS_MSG.SUCCEED }
        };
        await activityService.createActivity(activityToSave);

        if (user?.email) {
          await emailService.addPointEmail({ user, dailyConfig, point: pointResult });
        }
      }
    } else {
      //TODO add point activity
      const point = await pointService.addPoint(userLocation.id, dailyConfig);
      const activityToSave = {
        userId: user.id,
        victimId: point.id,
        model: ACTIVITY_MODEL.POINT,
        type: ACTIVITY_TYPE.UPDATE,
        metadata: { body: { ...userLocation, dailyConfig }, status: STATUS_MSG.SUCCEED }
      };
      await activityService.createActivity(activityToSave);
    }

    //request coupon when checkin
    const currentCheckinCount = (user?.checkinCount ?? 0) + 1;
    const backOffice = await BackOffice.query().findOne({
      checkinThreshold: currentCheckinCount,
      status: BACK_OFFICE_STATUS.active
    });
    if (backOffice) {
      await UserCoupon.query().insert({
        userId: user.id,
        amount: backOffice.coupon,
        code: uniqid('eg-'),
        type: backOffice.type,
        expirationDate: dateHelper.addDateTime({ days: backOffice.days }).toISOString(),
        status: USER_COUPON_STATUS.request,
        metadata: { desc: 'Checkin', date: new Date().toISOString(), ...backOffice }
      });
      // update the status expired coupons
      await UserCoupon.query()
        .patch({ status: USER_COUPON_STATUS.init })
        .where('userId', user.id)
        .where('status', USER_COUPON_STATUS.request)
        .where('expirationDate', '<', new Date());
    }
  }
  // increase the count whenever a customer checkin
  const updatedUser = await user
    .$query()
    .updateAndFetch({ checkinCount: (user?.checkinCount ?? 0) + 1 })
    .withGraphFetched('[role, avatar, userCoupons]');

  const { role, ...rest } = updatedUser;
  return {
    user: rest,
    role,
    accessToken,
    refreshToken
  };
};

export const verifyEmail = async (token) => {
  const verification = await Verification.query()
    .findOne({
      token,
      status: VERIFICATION_STATUS_MAPPER.ACTIVATED,
      type: VERIFICATION_TYPE_MAPPER.VERIFY_EMAIL
    })
    .throwIfNotFound({
      message: APP_MESSAGE.VERIFICATION.NOT_FOUND
    });

  const user = await User.query().updateAndFetchById(verification.victimId, {
    status: USER_STATUS_MAPPER.ACTIVATED
  });
  await emailService.confirmUserRegisterEmail({ user });
  await Verification.query()
    .update({
      status: VERIFICATION_STATUS_MAPPER.VERIFIED
    })
    .where({ id: verification.id });

  return {
    message: APP_MESSAGE.AUTH.SUCCESS_VERIFY
  };
};

export const forgotPassword = async (email) => {
  const user = await User.query().findOne({ email }).throwIfNotFound({
    message: APP_MESSAGE.USER.NOT_FOUND
  });

  const updatedUser = await user
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_EMAIL });

  const token = securityHelper.genRandomTokenString(40);
  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_EMAIL,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });

  await emailService.forgotPasswordEmail({ user, token });
  return {
    message: APP_MESSAGE.AUTH.SUCCESS_FORGOT_PASSWORD,
    userId: updatedUser.id
  };
};

export const resetPassword = async (token, password) => {
  const verification = await Verification.query()
    .findOne({
      token,
      status: VERIFICATION_STATUS_MAPPER.ACTIVATED,
      type: VERIFICATION_TYPE_MAPPER.VERIFY_EMAIL
    })
    .throwIfNotFound({
      message: APP_MESSAGE.VERIFICATION.NOT_FOUND
    });

  const user = await User.query().findById(verification.victimId).throwIfNotFound();

  const hashedPassword = await securityHelper.hashPassword(password);
  const updatedUser = await user.$query().updateAndFetch({
    password: hashedPassword,
    status: USER_STATUS_MAPPER.ACTIVATED
  });

  await emailService.resetPasswordEmail({ user, updatedUser });
  await Verification.query()
    .update({
      status: VERIFICATION_STATUS_MAPPER.VERIFIED
    })
    .where({ id: verification.id });

  return {
    message: APP_MESSAGE.AUTH.SUCCESS_RESET_PASSWORD,
    userId: updatedUser.id
  };
};

export const verifyPhone = async (token, res) => {
  const verification = await Verification.query()
    .findOne({
      token,
      status: VERIFICATION_STATUS_MAPPER.ACTIVATED,
      type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE
    })
    .throwIfNotFound({
      message: APP_MESSAGE.VERIFICATION.NOT_FOUND
    });

  const user = await User.query()
    .updateAndFetchById(verification.victimId, {
      status: USER_STATUS_MAPPER.ACTIVATED
    })
    .withGraphFetched('[role, avatar, userCoupons]');

  await Verification.query()
    .update({
      status: VERIFICATION_STATUS_MAPPER.VERIFIED
    })
    .where({ id: verification.id });

  const accessToken = await securityHelper.genJwtToken(user.id, '8h');
  const refreshToken = await securityHelper.genRefreshToken(user.id, '24h');

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);

  const { role, ...rest } = user;

  return {
    user: rest,
    role,
    accessToken,
    refreshToken
  };
};
