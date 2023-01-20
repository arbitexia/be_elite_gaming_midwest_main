import { locationService } from '@/services';

export const getLocations = async (req, res) => {
  try {
    const { filterBy } = req.query;
    const result = await locationService.loadLocations(filterBy);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await locationService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createLocation = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await locationService.createLocation(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id, input } = req.body;
    const result = await locationService.updateLocation(id, input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await locationService.deleteLocation(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
