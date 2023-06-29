import { userLocationService } from '@/services';

export const filter = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await userLocationService.filterByLocationId(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
