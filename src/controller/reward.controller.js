import { rewardService } from '@/services';

export const createReward = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await rewardService.createReward(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(e.message);
  }
};
