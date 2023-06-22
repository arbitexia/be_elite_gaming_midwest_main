import { configService } from '@/services';

export const getConfig = async (req, res) => {
  try {
    const result = await configService.findOne();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createConfig = async (req, res) => {
  try {
    const {
      input: { id, daily, weekly, monthly, checkinThreshold, coupon, initialCoupon }
    } = req.body;
    const result = await configService.save({
      id,
      daily,
      weekly,
      monthly,
      checkinThreshold,
      coupon,
      initialCoupon
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
