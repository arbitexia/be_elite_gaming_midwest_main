import { handler } from '@/workers/campaign-worker';

export const testSchedule = async (req, res) => {
  try {
    const result = await handler();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
