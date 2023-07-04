import { dateHelper, twilioHelper, workerHelper } from '@/helpers';
import { Log, User, Campaign } from '@/models';
import {
  JOB_NAMES,
  USER_ROLE_MAPPER,
  LOG_TYPES,
  ACTIVITY_MODEL,
  CAMPAIGN_MODEL,
  CAMPAIGN_TYPE,
  USER_STATUS_MAPPER,
  CAMPAIGN_CHANNELS,
  TEST_PHONE_NUMBER
} from '@/constants';
import { campaignWorkerEmail } from '@/services/email.service';
import { checkCampaignHistory, insertMessageId } from '@/services/campaign.service';
import { format, getMonth, getDate } from 'date-fns';

export const handler = async (event) => {
  try {
    if (!event.id) {
      const error = new Error('No job id', event);
      throw error;
    }
    let executedSchedule = [];
    const campaigns = await Campaign.query()
      .where('model', CAMPAIGN_MODEL.AUTO_PILOT)
      .andWhere('status', 1);
    if (campaigns.length > 0) {
      await Promise.all(
        campaigns.map(async (campaign) => {
          let users = [];
          let filteredUsers = [];
          const currentDate = new Date();
          const currentMonth = getMonth(currentDate) + 1;
          const currentDay = getDate(currentDate);
          if (
            currentDate >= new Date(campaign.startDate) &&
            currentDate <= new Date(campaign.endDate)
          ) {
            if (campaign.type === CAMPAIGN_TYPE.BIRTHDAY) {
              users = await User.query()
                .where('roleId', USER_ROLE_MAPPER.USER)
                .andWhere('status', USER_STATUS_MAPPER.ACTIVATED)
                .andWhereRaw('extract(month from birthday) = ?', [currentMonth])
                .andWhereRaw('extract(day from birthday) = ?', [currentDay]);
            } else if (campaign.type === CAMPAIGN_TYPE.WELCOME) {
              users = await User.query()
                .where('roleId', USER_ROLE_MAPPER.USER)
                .andWhere('status', USER_STATUS_MAPPER.ACTIVATED)
                .whereRaw('DATE(created_at) = ?', [format(currentDate, 'yyyy-MM-dd')]);
            }
          }
          const updateUsers = users.map(async (u, index) => {
            //check if campaign is already applied.
            const isAppliedCampaign = await checkCampaignHistory({
              user: u,
              campaign
            });
            if (!isAppliedCampaign) {
              await User.query().where('id', u.id).increment('coupon', campaign.offer);
              if (
                campaign.channels === CAMPAIGN_CHANNELS.EMAIL ||
                campaign.channels === CAMPAIGN_CHANNELS.BOTH
              ) {
                // send email
                const retMessage = await campaignWorkerEmail({
                  user: u,
                  jobInfo: {
                    amount: campaign.offer,
                    campaignType: campaign.type
                  }
                });
                await insertMessageId({
                  campaignId: campaign.id,
                  messageId: retMessage.messageId,
                  victimId: u.id
                });
              }
              if (
                campaign.channels === CAMPAIGN_CHANNELS.PHONE ||
                campaign.channels === CAMPAIGN_CHANNELS.BOTH
              ) {
                const isTester = TEST_PHONE_NUMBER.some((number) => u.phone.includes(number));
                if (!isTester) {
                  await twilioHelper.SendTextSms({
                    body:
                      campaign.type === CAMPAIGN_TYPE.BIRTHDAY
                        ? `You got coupons $${campaign.offer} today.`
                        : 'Welcome to elitegame.',
                    to: u.phone
                  });
                  await insertMessageId({
                    campaignId: Number(campaign.id),
                    messageId: `phone_${u.phone}`,
                    victimId: Number(u.id)
                  });
                }
                //increase redeemed on the campaign table
                await Campaign.query()
                  .update({ redeemed: campaign.redeemed + index + 1 })
                  .where('id', campaign.id);
              }
              // update total field on the campaign table
              await Campaign.query()
                .update({ total: campaign.total + index + 1 })
                .where('id', campaign.id);

              filteredUsers.push(u);
            }
          });
          await Promise.all(updateUsers);
          if (filteredUsers.length > 0) {
            executedSchedule = [...executedSchedule, { campaign, user: filteredUsers }];
          }
        })
      );
    }

    if (executedSchedule.length > 0) {
      const insertData = {
        logType: LOG_TYPES.BACKGROUND_JOB,
        logModel: ACTIVITY_MODEL.CAMPAIGN,
        metadata: {
          eventId: event.id,
          jobName: JOB_NAMES.RUN_CAMPAIGN_WORKER,
          data: executedSchedule
        }
      };
      await Log.query().insert(insertData);
    }
    await workerHelper.dispatchJob(event.id, JOB_NAMES.RUN_CAMPAIGN_WORKER);
  } catch (error) {
    console.log({
      msg: `Caught exception while processing Schedule worker: ${error.message}`
    });
  }
};
