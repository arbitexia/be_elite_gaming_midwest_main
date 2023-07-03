import twilio from 'twilio';
import config from '@/config';
import { BadRequest } from '@/provider/error';
const client = new twilio(config.TWILLIO.ACCOUNT_SID, config.TWILLIO.AUTH_TOKEN);

export const SendTextSms = async ({ body, to }) => {
  try {
    const result = await client.messages.create({
      body,
      messagingServiceSid: config.TWILLIO.MESSAGE_SID,
      to
    });
    return result;
  } catch (e) {
    throw new BadRequest(e.message);
  }
};
