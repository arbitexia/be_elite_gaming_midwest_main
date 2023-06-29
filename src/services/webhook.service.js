import { Campaign, CampaignHistory } from '@/models';
import { APP_MESSAGE } from '@/constants';
/**
 * request
 * @body {
 *  "id": 833778,
    "date": '2023-06-28 04:45:46',
    "email": "example@example.com",
    "event": 'unique_opened',
    "message-id": '<649c391f769f6fdf79050521@domain.com>',
    "ts": 1687959946,
    "ts_event": 1687959946
 * }
 */
export const checkOpenedEmailHandler = async (body) => {
  if (body.event === 'unique_opened') {
    const campaignHistory = await CampaignHistory.query()
      .findOne({
        messageId: body['message-id']
      })
      .withGraphFetched('[campaign]');
    if (campaignHistory) {
      await Campaign.query()
        .update({ redeemed: campaignHistory.campaign.redeemed + 1 })
        .where('id', campaignHistory.campaignId);
      return APP_MESSAGE.CAMPAIGN.SUCCESS_UPDATE;
    }
  }
  return APP_MESSAGE.CAMPAIGN.NOT_FOUND;
};
