import { pointService } from '@/services';

export const getPoint = async (req, res) => {
  try {
    const { userId, locationId } = req.params;
    const result = await pointService.getPoint(userId, locationId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pointService.getPoints(userId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
