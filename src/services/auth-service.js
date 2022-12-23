import { User, Verification } from '@/models';
import { securityHelper } from '@/helpers';
import {
  APP_MESSAGE,
  USER_STATUS_MAPPER,
  USER_ROLE_MAPPER,
  VERIFICATION_TYPE_MAPPER,
  VERIFICATION_STATUS_MAPPER
} from '@/constants';
import { BadRequest } from '@/provider/error';
import config from '@/config';
import twilio from 'twilio';

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token'; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

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

  const updatedUser = await User.query().updateAndFetchById(5, { userName: 'verify' });
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
