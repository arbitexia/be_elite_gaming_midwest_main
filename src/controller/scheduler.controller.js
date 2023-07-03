import { twilioHelper } from '@/helpers';
import { handler } from '@/workers/campaign-worker';

export const testSchedule = async (req, res) => {
  try {
    // const result = await handler();
    const result = await twilioHelper.SendTextSms({
      body: 'Your verification code is',
      to: '8482783246'
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
