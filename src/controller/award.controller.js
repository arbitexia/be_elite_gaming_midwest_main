import { awardService } from '@/services';

export const getAwards = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await awardService.loadAwards(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getAward = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await awardService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const sendRequest = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createAward = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await awardService.createAward(input);
    //TODO Send Email to customer
    //TODO Activity
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const acceptAward = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const result = await awardService.acceptAward(id, user.id);
    //TODO Send Email to customer
    //TODO Activity
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const declineAward = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const result = await awardService.declineAward(id, user.id);
    //TODO Send Email to customer
    //TODO Activity
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
