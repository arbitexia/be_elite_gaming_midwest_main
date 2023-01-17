import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userService } from '@/services';
import { User } from '@/models';
import config from '@/config';

const DEBUG = config.NODE_ENV === 'development';
const saltRounds = 10;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.APP_SECRET
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await userService.getOne(payload.userId);
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  })
);

export const genRandomTokenString = (length) => crypto.randomBytes(length).toString('hex');
export const genPhoneVerifyToken = () => crypto.randomInt(1000, 9999);

export const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(error);
        resolve(hash);
      });
    });
  });

export const validatePassword = (password, hashedPassword) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

export const genJwtToken = (userId, expiresIn) =>
  new Promise((resolve) => {
    const token = jwt.sign({ userId }, config.APP_SECRET, { expiresIn });

    resolve(token);
  });

export const genRefreshToken = (accessToken, expiresIn) =>
  new Promise((resolve) => {
    const token = jwt.sign({ accessToken }, config.APP_SECRET, { expiresIn });
    resolve(token);
  });

export const decodeJwtToken = (token) =>
  new Promise((resolve, reject) => {
    const key = config.APP_SECRET;
    jwt.verify(token, key, (error, decoded) => {
      if (error) reject(new AuthenticationError(error.message));
      resolve(decoded);
    });
  });

export const setTokenToCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: !DEBUG,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
};

export const getTokenFromCookie = (req) => req.cookies?.refreshToken;

export const destroyTokenCookie = (res) => {
  const cookieOptions = {
    expires: Date.now()
  };
  res.cookie('refreshToken', cookieOptions);
};

export const genOneTimeToken = (email, roleId) =>
  new Promise((resolve) => {
    const token = jwt.sign({ email, roleId }, config.appSecret);

    resolve(token);
  });

export const hasUserIdOnRequest = async (req) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  authHeader = authHeader.replace('Bearer ', '');
  const { userId } = await decodeJwtToken(authHeader);
  if (!userId) {
    const error = new AuthenticationError();
    throw error;
  }
  const user = await userService.getOne(userId);
  return user;
};

export { passport as JwtAuth };
