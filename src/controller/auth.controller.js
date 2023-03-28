import {
  authService,
  userLocationService,
  pointService,
  locationService,
  activityService
} from '@/services';
import { ipToLocationInfo, convertIpFromV6ToV4 } from '@/helpers';
import {
  ACTIVITY_MODEL,
  ACTIVITY_TYPE,
  APP_MESSAGE,
  STATUS_MSG,
  USER_STATUS_MAPPER
} from '@/constants';

export const authorize = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.authorize(identifier, password, res);
    //TODO add auth Activity
    const activityToSave = {
      userId: result.user.id,
      victimId: result.user.id,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.LOGIN,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.LOGIN,
      model: ACTIVITY_MODEL.USER,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'authorize'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken, userId } = await authService.refreshToken(refreshToken, res);
    //TODO add auth Activity
    const activityToSave = {
      userId,
      victimId: userId,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.GET,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json({ accessToken });
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.AUTH,
      model: ACTIVITY_MODEL.GET,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'refreshToken'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const authorizeTablet = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.authorizeTablet(identifier, password, res);
    const userLocation = await userLocationService.getOneByTablet(result.user.id);
    //TODO add auth Activity
    const activityToSave = {
      userId: result.user.id,
      victimId: result.user.id,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.CHECKIN,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json({ ...result, location: userLocation?.location ?? null });
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.CHECKIN,
      model: ACTIVITY_MODEL.USER,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'authorizeTablet'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const authorizeCustomer = async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await authService.authorizeCustomer(identifier, res);
    //TODO add auth Activity
    const { userId, ...rest } = result;
    const activityToSave = {
      userId,
      victimId: userId,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.SIGNUP,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(rest);
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.SIGNUP,
      model: ACTIVITY_MODEL.USER,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'authorizeCustomer'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const authorizeCustomerFromTablet = async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await authService.authorizeCustomerFromTablet(identifier, res);
    const activityToSave = {
      userId: result.user.id,
      victimId: result.user.id,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.SIGNUP,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    if (result.user.status === USER_STATUS_MAPPER.ACTIVATED) {
      //TODO add auth Activity
      await activityService.createActivity(activityToSave);
      res.status(200).json({ message: APP_MESSAGE.USER.SUCCESS, ...result });
    } else {
      await activityService.createActivity({
        ...activityToSave,
        metadata: {
          ...req.body,
          status: STATUS_MSG.FAILED,
          error: 'Your number is not activated',
          function: 'authorizeCustomerFromTablet'
        }
      });
      res.status(500).json('Your number is not activated');
    }
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.SIGNUP,
      model: ACTIVITY_MODEL.USER,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'authorizeCustomerFromTablet'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const tablet = req.user;
    const { token } = req.body;
    const result = await authService.verifyPhone(token, res);
    if (tablet) {
      const userLocation = await userLocationService.checkIn(tablet.id, result.user.id);
      await pointService.checkIn(userLocation.id);
      //TODO Check user can get the coupons
    }
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      type: ACTIVITY_TYPE.CHECKIN,
      metadata: {},
      event: 'authorizeCustomer',
      status: REQUEST_STATUS.FAILED,
      errorMessage: JSON.stringify(e.message)
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const createNewUser = async (req, res) => {
  try {
    const user = req.body;
    const result = await authService.createNewUser(user);
    //TODO add register Activity
    const activityToSave = {
      userId: result.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.CREATE,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (error) {
    const activityToSave = {
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.CREATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'createNewUser'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const register = async (req, res) => {
  try {
    const { phone, email, birthday } = req.body;
    // const clientIp = convertIpFromV6ToV4(req.clientIp);
    const locationInfo = await ipToLocationInfo(req.clientIp);
    const result = await authService.register(phone, email, birthday, locationInfo);
    //TODO add register Activity
    const { userId, ...rest } = result;
    const activityToSave = {
      userId,
      victimId: userId,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.CREATE,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(rest);
  } catch (e) {
    const activityToSave = {
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.CREATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'register'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    //TODO add forgot password Activity
    const { userId, ...rest } = result;
    const activityToSave = {
      userId,
      victimId: userId,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(rest);
  } catch (e) {
    const activityToSave = {
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'forgotPassword'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    //TODO add reset password Activity
    const { userId, ...rest } = result;
    const activityToSave = {
      userId,
      victimId: userId,
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(rest);
  } catch (e) {
    const activityToSave = {
      model: ACTIVITY_MODEL.USER,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'resetPassword'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};
