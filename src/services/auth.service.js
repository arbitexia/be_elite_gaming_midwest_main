import { User, Verification, EmailTemplate, Point, Config, UserLocation, Tablet } from '@/models';
import { securityHelper, placeholderHelper } from '@/helpers';
import {
  APP_MESSAGE,
  USER_STATUS_MAPPER,
  USER_ROLE_MAPPER,
  VERIFICATION_TYPE_MAPPER,
  VERIFICATION_STATUS_MAPPER,
  EMAIL_TEMPLATE_MAPPER
} from '@/constants';
import { AWSProvider } from '@/provider';
import { BadRequest } from '@/provider/error';
import config from '@/config';
import twilio from 'twilio';
import { formatDistanceStrict } from 'date-fns';
import { pointService, userLocationService } from '@/services';

const client = new twilio(config.TWILLIO.ACCOUNT_SID, config.TWILLIO.AUTH_TOKEN);

export const refreshToken = async (refreshToken, res) => {
  const refreshDecoded = await securityHelper.decodeJwtToken(refreshToken);
  const userId = refreshDecoded.userId;
  const newToken = await securityHelper.genJwtToken(userId, '8h');
  return { accessToken: newToken, userId };
};

export const createNewUser = async (param) => {
  const user = await User.query().findOne({ email: param.email });
  if (user) throw new BadRequest(APP_MESSAGE.AUTH.DUPLICATED_EMAIL);

  const { firstName, lastName, email, address, phone, birthday, status, roleId } = param;
  const newUser = await User.query()
    .insertAndFetch({
      firstName,
      lastName,
      email,
      location: address,
      phone,
      birthday: birthday ?? '1991-10-10',
      status,
      roleId
    })
    .withGraphFetched('[role, avatar]');
  return newUser;
};

export const register = async (phone, email, birthday, locationInfo) => {
  const user = await User.query().findOne({
    phone,
    roleId: USER_ROLE_MAPPER.USER
  });
  if (user) throw new BadRequest(APP_MESSAGE.AUTH.DUPLICATED_PHONE);
  const token = securityHelper.genPhoneVerifyToken().toString();

  // await client.messages
  //   .create({
  //     body: `Your verification code is ${token}. It is valid for 5 minutes. Do not provide this verification code to anyone.`,
  //     messagingServiceSid: config.TWILLIO.MESSAGE_SID,
  //     to: phone
  //   })
  //   .catch((e) => {
  //     throw new BadRequest(e.message);
  //   });

  const newUser = await User.query()
    .insertAndFetch({
      phone,
      email,
      birthday,
      roleId: USER_ROLE_MAPPER.USER,
      firstLogin: locationInfo,
      status: USER_STATUS_MAPPER.VERIFY_PHONE
    })
    .withGraphFetched('[role, avatar]');
  const updatedUser = await newUser
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });
  return {
    message: APP_MESSAGE.AUTH.SEND_REGISTER_VERIFY + 'Token: ' + token,
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

  const accessToken = await securityHelper.genJwtToken(tablet.id, '24h');
  const refreshToken = await securityHelper.genRefreshToken(tablet.id, '24h');

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
    .withGraphFetched('[role, avatar]')
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
      // status: USER_STATUS_MAPPER.ACTIVATED
    })
    .withGraphFetched('[role, avatar]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });
  const token = securityHelper.genPhoneVerifyToken().toString();
  // await client.messages
  //   .create({
  //     body: `Your verification code is ${token}. It is valid for 5 minutes. Do not provide this verification code to anyone.`,
  //     messagingServiceSid: config.TWILLIO.MESSAGE_SID,
  //     to: user.phone
  //   })
  //   .catch((e) => {
  //     throw new BadRequest(e.message);
  //   });

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
    message: token, //APP_MESSAGE.AUTH.SEND_AUTH_VERIFY,
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
    .withGraphFetched('[role, avatar]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });

  const accessToken = await securityHelper.genJwtToken(user.id, '8h');
  const refreshToken = await securityHelper.genRefreshToken(user.id, '24h');

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);

  const configItem = await Config.query().first();
  const dailyConfig = configItem?.daily ?? 50;
  const userLocation = await userLocationService.checkIn(locationId, user.id);
  if (userLocation) {
    const point = await Point.query().findOne({ userLocationId: userLocation.id });
    if (point?.updatedAt) {
      const distance = formatDistanceStrict(new Date(), point.updatedAt, { unit: 'day' }).split(
        ' '
      )[0];
      if (Number(distance) > 0) {
        const pointResult = await pointService.addPoint(userLocation.id, dailyConfig);
        if (user?.email) {
          const template = await EmailTemplate.query().findOne({
            useFor: EMAIL_TEMPLATE_MAPPER.ADD_POINT_EMAIL
          });
          const { subject, htmlBody } = await placeholderHelper({
            template,
            userInfo: user,
            pointInfo: { point: dailyConfig, totalPoint: pointResult?.totalPoint ?? dailyConfig }
          });
          try {
            const awsProvider = new AWSProvider();
            await awsProvider.sendEmail(user.email, subject, htmlBody);
          } finally {
          }
        }
      }
    } else {
      await pointService.addPoint(userLocation.id, dailyConfig);
    }
  }

  const { role, ...rest } = user;
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

  const updatedUser = await user
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_EMAIL });

  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_EMAIL,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });

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

  const template = await EmailTemplate.query()
    .findOne({
      useFor: EMAIL_TEMPLATE_MAPPER.CONFIRM_EMAIL_RESET_PASSWORD
    })
    .throwIfNotFound({
      message: APP_MESSAGE.EMAIL_TEMPLATE.NOT_FOUND
    });

  const hashedPassword = await securityHelper.hashPassword(password);
  const updatedUser = await user.$query().updateAndFetch({
    password: hashedPassword,
    status: USER_STATUS_MAPPER.ACTIVATED
  });

  const { subject, htmlBody } = await placeholderHelper({
    template,
    userInfo: updatedUser
  });
  const awsProvider = new AWSProvider();
  await awsProvider.sendEmail(user.email, subject, htmlBody);

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
