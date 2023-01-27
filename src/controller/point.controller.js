import { pointService } from '@/services';

export const getPoint = async (req, res) => {
  try {
    const { userId, locationId } = req.query;
    const result = await pointService.getPoint(userId, locationId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
