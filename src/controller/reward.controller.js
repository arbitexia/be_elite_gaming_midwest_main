import { rewardService } from '@/services';

export const filter = async (req, res) => {
  try {
    const { condition, cursor } = req.query;
    const results = await rewardService.filter(condition);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(e.message);
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await rewardService.getOne(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(e.message);
  }
};

export const create = async (req, res) => {
  try {
    const { input } = req.body;
    const results = await rewardService.create(input);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(e.message);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    const result = await rewardService.update(id, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(e.message);
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await rewardService.destroy(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(e.message);
  }
};
