import { USER_COUPON_STATUS } from '@/constants';
import { twilioHelper } from '@/helpers';
import { UserCoupon } from '@/models';
import { handler } from '@/workers/campaign-worker';

export const testSchedule = async (req, res) => {
  try {
    const result = await handler();
    // // const result = await twilioHelper.SendTextSms({
    // //   body: 'Your verification code is',
    // //   to: '8482783246'
    // // });
    // const result = await UserCoupon.query()
    //   .patch({ status: USER_COUPON_STATUS.init })
    //   .where('userId', 35)
    //   .where('status', USER_COUPON_STATUS.request)
    //   .where('expirationDate', '<', new Date());
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
