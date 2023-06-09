import { workerHelper } from '@/helpers';
import { Log, Reward, UserLocation } from '@/models';
import { ACTIVITY_MODEL, JOB_NAMES, LOG_TYPES } from '@/constants';
import { rewardCouponWorkerEmail, rewardPointWorkerEmail } from '@/services/email.service';

export const handler = async (event) => {
  try {
    if (!event.id) {
      const error = new Error('No job id', event);
      throw error;
    }
    const customers = await UserLocation.query()
      .joinRelated('point')
      .withGraphFetched('[point, user]');
    const rewards = await Reward.query().withGraphFetched('[product]');

    let executedSchedule = [];

    if (customers.length > 0) {
      executedSchedule = await Promise.all(
        customers.map(async (customer) => {
          let filteredRewards = [];
          let customerPoint = 0;

          if (customer.point && customer.point.length > 0) {
            customerPoint = customer.point[0].point;
            filteredRewards = rewards.filter(
              (obj) =>
                obj.pointThreshold !== 0 &&
                obj.pointThreshold <= customerPoint &&
                obj.locationId === customer.locationId
            );
            //send the email for point
            if (filteredRewards.length > 0) {
              // const theEmailContents = filteredRewards.map((obj) => {
              //   return {
              //     content: `You are ${obj.point - customerPoint} points away from unlocking an ${
              //       obj.product.name
              //     }.`
              //   };
              // });
              // const contentString = theEmailContents.map((item) => item.content).join(' ');
              await rewardPointWorkerEmail({
                user: customer.user,
                jobInfo: {
                  amount: filteredRewards[0].point - customerPoint,
                  productName: filteredRewards[0].product.name
                }
              });
            }
          }

          if (filteredRewards.length <= 0 && customer.user.coupon) {
            filteredRewards = rewards.filter(
              (obj) =>
                obj.couponThreshold !== 0 &&
                obj.couponThreshold <= customer.user.coupon &&
                obj.locationId === customer.locationId
            );
            // send the email for coupon
            if (filteredRewards.length > 0) {
              await rewardCouponWorkerEmail({
                user: customer.user,
                jobInfo: {
                  amount: filteredRewards[0].coupon - customer.user.coupon,
                  productName: filteredRewards[0].product.name
                }
              });
            }
          }

          return {
            ...customer.user,
            point: customerPoint,
            rewards: filteredRewards
          };
        })
      );
    }

    const insertData = {
      logType: LOG_TYPES.BACKGROUND_JOB,
      logModel: ACTIVITY_MODEL.USER,
      victimId: 1,
      metadata: {
        eventId: 2,
        jobName: JOB_NAMES.RUN_COUPON_WORKER,
        data: {}
      }
    };

    await Log.query().insert(insertData);
    await workerHelper.dispatchJob(event.id, JOB_NAMES.RUN_REWARD_WORKER);

    return insertData;
  } catch (error) {
    console.log({
      msg: `Caught exception while processing Schedule worker: ${error.message}`
    });
  }
};
