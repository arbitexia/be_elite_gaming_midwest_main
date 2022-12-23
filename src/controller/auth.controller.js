import { authService } from '@/services';

export const authorize = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.authorize(identifier, password, res);
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
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyPhone(token, res);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};
