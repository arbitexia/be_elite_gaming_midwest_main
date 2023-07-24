import { BackOffice, Config } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const findOne = async () => {
  const config = await Config.query().first().throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return config;
};

export const save = async ({
  id,
  daily,
  weekly,
  monthly,
  checkinThreshold,
  coupon,
  initialCoupon
}) => {
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
      coupon,
      initialCoupon
    });
  } else {
    result = await Config.query().insertAndFetch({
      daily,
      weekly,
      monthly,
      checkinThreshold,
      coupon,
      initialCoupon
    });
  }
  return result;
};

export const findBackOffice = async () => {
  const backOffices = await BackOffice.query().orderBy('id', 'ASC');
  return backOffices;
};

export const saveBackOffice = async (body) => {
  let result;
  const backOffices = await BackOffice.query();
  if (backOffices.length > 0) {
    //update
    result = await Promise.all(
      body.map(async (obj) => {
        await BackOffice.query()
          .findById(obj.id)
          .patch({
            coupon: obj.coupon,
            checkinThreshold: obj.checkinThreshold,
            days: obj.days,
            code: obj.code,
            expirationDate: new Date(obj.expirationDate).toISOString(),
            type: obj.type,
            status: obj.status
          });
      })
    );
  } else {
    //create
    result = await Promise.all(
      body.map(async (obj) => {
        await BackOffice.query().insert({
          coupon: obj.coupon,
          checkinThreshold: obj.checkinThreshold,
          days: obj.days,
          code: obj.code,
          expirationDate: new Date(obj.expirationDate).toISOString(),
          type: obj.type,
          status: obj.status
        });
      })
    );
  }

  return { message: APP_MESSAGE.BACK_OFFICE.SUCCESS_SAVE };
};
