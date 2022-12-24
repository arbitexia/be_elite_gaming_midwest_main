import { User, Verification, EmailTemplate } from '@/models';
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

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token'; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

export const register = async (phone, email, birthday, res) => {
  const user = await User.query().findOne({
    phone,
    roleId: USER_ROLE_MAPPER.USER
  });
  if (user) throw new BadRequest(APP_MESSAGE.AUTH.DUPLICATED_PHONE);
  const newUser = await User.query()
    .insertAndFetch({
      phone,
      email,
      birthday,
      roleId: USER_ROLE_MAPPER.USER,
      status: USER_STATUS_MAPPER.VERIFY_PHONE
    })
    .withGraphFetched('[role, avatar]');

  const updatedUser = await newUser
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
  const token = securityHelper.genPhoneVerifyToken().toString();

  client.messages
    .create({
      body: `Your verification code is ${token}. It is valid for 5 minutes. Do not provide this verification code to anyone.`,
      to: user.phone,
      from: '+12345678901' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });

  return {
    message: APP_MESSAGE.AUTH.SEND_VERIFY
  };
};

export const authorize = async (identifier, password, res) => {
  const user = await User.query()
    .findOne({
      userName: identifier,
      status: USER_STATUS_MAPPER.ACTIVATED
    })
    .where((builder) => {
      builder
        .where('roleId', USER_ROLE_MAPPER.ADMIN)
        .orWhere('roleId', USER_ROLE_MAPPER.SUPER)
        .orWhere('roleId', USER_ROLE_MAPPER.TABLET);
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

  const accessToken = await securityHelper.genJwtToken(user.id, '24h');
  const refreshToken = await securityHelper.genRefreshToken();

  if (!config.DEBUG) securityHelper.setTokenToCookie(res, refreshToken);
  const { role, ...rest } = user;

  return {
    user: rest,
    role,
    accessToken,
    refreshToken
  };
};

export const verifyPhone = async (token, res) => {
  console.log(token);
  const verification = await Verification.query()
    .findOne({
      token,
      status: VERIFICATION_STATUS_MAPPER.ACTIVATED,
      type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE
    })
    .throwIfNotFound({
      message: APP_MESSAGE.VERIFICATION.NOT_FOUND
    });
  console.log(verification);
  const user = await User.query()
    .updateAndFetchById(verification.victimId, {
      status: USER_STATUS_MAPPER.ACTIVATED
    })
    .withGraphFetched('[role, avatar]');

  await Verification.query()
    .update({
      status: VERIFICATION_STATUS_MAPPER.VERIFIED
    })
    .where({ id: verification.id });

  const accessToken = await securityHelper.genJwtToken(user.id, '1h');
  const refreshToken = await securityHelper.genRefreshToken();

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
      roleId: USER_ROLE_MAPPER.USER,
      status: USER_STATUS_MAPPER.ACTIVATED
    })
    .withGraphFetched('[role, avatar]')
    .throwIfNotFound({
      message: APP_MESSAGE.AUTH.NOT_FOUND_USER,
      type: 'NOT_FOUND'
    });

  const updatedUser = await user
    .$query()
    .updateAndFetch({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
  const token = securityHelper.genPhoneVerifyToken().toString();

  client.messages
    .create({
      body: `Your verification code is ${token}. It is valid for 5 minutes. Do not provide this verification code to anyone.`,
      to: user.phone,
      from: '+12345678901' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

  await Verification.query().insert({
    victimId: updatedUser.id,
    type: VERIFICATION_TYPE_MAPPER.VERIFY_PHONE,
    token,
    status: VERIFICATION_STATUS_MAPPER.ACTIVATED
  });

  return {
    message: APP_MESSAGE.AUTH.SEND_VERIFY
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
    message: APP_MESSAGE.AUTH.SUCCESS_FORGOT_PASSWORD
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
    message: APP_MESSAGE.AUTH.SUCCESS_RESET_PASSWORD
  };
};
