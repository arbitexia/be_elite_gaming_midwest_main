//don't use
import { workerHelper } from '@/helpers';
import { Log, User, Config } from '@/models';
import { JOB_NAMES, USER_ROLE_MAPPER, LOG_TYPES, ACTIVITY_MODEL } from '@/constants';
import { couponWorkerEmail } from '@/services/email.service';

export const handler = async (event) => {
  try {
    if (!event.id) {
      const error = new Error('No job id', event);
      throw error;
    }
    const customers = await User.query().where('role_id', USER_ROLE_MAPPER.USER);
    const configs = await Config.query().first();
    let executedSchedule = [];

    if (customers.length > 0) {
      const pageSize = 10;
      const totalPages = Math.ceil(customers.length / pageSize);
      for (let page = 0; page < totalPages; page++) {
        const start = page * pageSize;
        const end = start + pageSize;
        const batchCustomers = customers.slice(start, end);
        const batchResults = await Promise.all(
          batchCustomers.map(async (customer) => {
            if (
              customer.checkinCount &&
              configs.checkinThreshold &&
              customer.checkinCount >= (configs?.checkinThreshold ?? 0)
            ) {
              //send email
              await couponWorkerEmail({
                user: customer,
                jobInfo: {
                  amount: configs.coupon
                }
              });

              await User.query()
                .findById(customer.id)
                .patch({ checkinCount: 0, coupon: (customer?.coupon ?? 0) + configs.coupon });
            }
            return {
              ...customer,
              ...configs
            };
          })
        );
        executedSchedule = executedSchedule.concat(batchResults);
      }
    }

    const insertData = {
      logType: LOG_TYPES.BACKGROUND_JOB,
      logModel: ACTIVITY_MODEL.USER,
      metadata: {
        eventId: event.id,
        jobName: JOB_NAMES.RUN_COUPON_WORKER,
        data: executedSchedule
      }
    };
    await Log.query().insert(insertData);
    await workerHelper.dispatchJob(event.id, JOB_NAMES.RUN_COUPON_WORKER);
  } catch (error) {
    console.log({
      msg: `Caught exception while processing Schedule worker: ${error.message}`
    });
  }
};
