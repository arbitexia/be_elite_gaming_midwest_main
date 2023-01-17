import { authService, userLocationService } from '@/services';

export const authorize = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.authorize(identifier, password, res);
    //TODO add auth Activity
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken, password, res);
    //TODO add auth Activity
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const authorizeTablet = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.authorizeTablet(identifier, password, res);
    //TODO add auth Activity
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const authorizeCustomer = async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await authService.authorizeCustomer(identifier, res);
    //TODO add auth Activity
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
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
      // await pointService.checkIn(userLocation.id);
      // await Point.query()
      //   .increment('point', DEAULT_INC_POINT)
      //   .where({ userLocationId: location.id });
      // await Point.query().insert({
      //   userLocationId: newLocation.id,
      //   point: DEAULT_INC_POINT
      // });
    }
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const register = async (req, res) => {
  try {
    const { phone, email, birthday } = req.body;
    const result = await authService.register(phone, email, birthday, res);
    //TODO add register Activity
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (e) {
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
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
