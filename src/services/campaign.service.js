import { Campaign, CampaignHistory } from '@/models';
import { ACTIVITY_MODEL, APP_MESSAGE } from '@/constants';
import { fractionateHelper } from '@/helpers';

export const findCampaigns = async (filterBy) => {
  let queryBuilder;
  const { filter } = await fractionateHelper('campaign');
  queryBuilder = filter(filterBy);
  const campaigns = await queryBuilder;
  return campaigns;
};

export const save = async ({
  id,
  name,
  model,
  type,
  offer,
  offerType,
  startDate,
  endDate,
  status,
  channels
}) => {
  let result;
  if (id > 0) {
    const campaign = await Campaign.query().findOne({ id }).throwIfNotFound({
      message: APP_MESSAGE.CONFIG,
      type: 'NOT_FOUND'
    });
    result = await campaign.$query().updateAndFetch({
      name,
      model,
      type,
      offer,
      offerType,
      startDate,
      endDate,
      status,
      channels
    });
  } else {
    result = await Campaign.query().insertAndFetch({
      name,
      model,
      type,
      offer,
      offerType,
      startDate,
      endDate,
      status,
      channels
    });
  }
  return result;
};

export const destroy = async (id) => {
  const campaign = await Campaign.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.CAMPAIGN.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await campaign.$query().delete();
  return {
    message: APP_MESSAGE.CAMPAIGN.SUCCESS_DELETE
  };
};

export const insertMessageId = async ({ campaignId, messageId, victimId }) => {
  try {
    await CampaignHistory.query().insert({
      campaignId,
      messageId,
      victimId,
      model: ACTIVITY_MODEL.USER
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkCampaignHistory = async ({ user, campaign }) => {
  const campaignHistory = await CampaignHistory.query()
    .whereBetween('createdAt', [campaign.startDate, campaign.endDate])
    .andWhere('campaignId', campaign.id)
    .andWhere('victimId', user.id)
    .andWhere('model', ACTIVITY_MODEL.USER);

  if (campaignHistory && campaignHistory.length > 0) {
    return true;
  }
  return false;
};
