import { assetService } from '@/services';

export const createUploadForm = async (req, res) => {
  try {
    const { fileName } = req.body;
    const result = await assetService.createUploadForm(fileName);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createAsset = async (req, res) => {
  try {
    const { input } = req.body;
    const { desc, name, type, url } = input;
    const result = await assetService.createAsset(desc, name, type, url);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createGallery = async (req, res) => {
  try {
    const {
      input: { assetId, victimId, model }
    } = req.body;
    const result = await assetService.createGallery(assetId, victimId, model);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { assetId } = req.body;
    const result = await assetService.updateGallery(+id, +assetId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assetService.deleteGallery(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
