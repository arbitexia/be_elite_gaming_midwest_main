import { Config } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const findOne = async () => {
  const config = await Config.query().first().throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return config;
};

export const save = async ({ id, daily, weekly, monthly, checkinThreshold, coupon }) => {
  let result;
  if (id > 0) {
    const config = await Config.query().findOne({ id }).throwIfNotFound({
      message: APP_MESSAGE.CONFIG,
      type: 'NOT_FOUND'
    });
    result = await config.$query().updateAndFetch({
      daily,
      weekly,
      monthly,
      checkinThreshold,
      coupon
    });
  } else {
    result = await Config.query().insertAndFetch({
      daily,
      weekly,
      monthly,
      checkinThreshold,
      coupon
    });
  }
  return result;
};
