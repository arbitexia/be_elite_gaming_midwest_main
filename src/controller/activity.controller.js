import { activityService } from '@/services';

export const filter = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const results = await activityService.getActivities(filterBy, cursor);
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await activityService.deleteActivity(id);
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
