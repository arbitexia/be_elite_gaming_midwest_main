import { assetService } from '@/services';

export const createUploadForm = async (req, res) => {
  try {
    const { fileName } = req.body;
    const result = await assetService.createUploadForm(fileName);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const createAsset = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await assetService.createAsset(input);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};

export const createGallery = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await assetService.createGallery(input);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
};
