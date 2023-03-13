import { locationService } from '@/services';

export const filter = async (req, res) => {
  try {
    const { filterBy } = req.query;
    const result = await locationService.filter(filterBy);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await locationService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const create = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await locationService.create(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    const result = await locationService.update(id, input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await locationService.destroy(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
