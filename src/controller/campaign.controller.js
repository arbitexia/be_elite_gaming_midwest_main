import { campaignService } from '@/services';

export const getCampaigns = async (req, res) => {
  try {
    const { filterBy } = req.query;
    const result = await campaignService.findCampaigns(filterBy);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const saveCampaign = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await campaignService.save(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await campaignService.destroy(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
