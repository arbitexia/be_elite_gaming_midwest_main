import { tabletService } from '@/services';

export const getTablets = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await tabletService.loadTablets(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createTablet = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await tabletService.createTablet(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updateTablet = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await tabletService.updateTablet(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteTablet = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tabletService.deleteTablet(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const changePasswordTablet = async (req, res) => {
  try {
    const { tabletId, oldPassword, password } = req.body;
    const result = await tabletService.updatePassword(tabletId, oldPassword, password);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
