import twilio from 'twilio';
import config from '@/config';
const client = new twilio(config.TWILLIO.ACCOUNT_SID, config.TWILLIO.AUTH_TOKEN);

export const SendTextSms = async ({ body, to }) => {
  await client.messages
    .create({
      body,
      messagingServiceSid: config.TWILLIO.MESSAGE_SID,
      to
    })
    .catch((e) => {
      throw new BadRequest(e.message);
    });
};
