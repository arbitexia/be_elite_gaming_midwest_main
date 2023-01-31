import uniqid from 'uniqid';
import config from '@/config';
import { AWSProvider } from '@/provider';
import { Asset, Gallery } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const createUploadForm = (fileName) => {
  const s3Key = `assets/${uniqid()}_${fileName}`;
  const awsProvider = new AWSProvider();
  return awsProvider.createPresignedPostData(fileName, config.AWS.S3_ASSET_BUCKET, s3Key);
};

export const createAsset = async (desc, name, type, url) => {
  const asset = await Asset.query().insertAndFetch({ desc, name, type, url });
  return asset;
};

export const updateGallery = async (id, assetId) => {
  const gallery = await Gallery.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.GALLERY.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  const updateGallery = await gallery
    .$query()
    .updateAndFetch({ assetId })
    .withGraphFetched('[asset]');
  return updateGallery;
};

export const createGallery = async (assetId, victimId, model) => {
  const gallery = await Gallery.query()
    .insertAndFetch({ assetId, victimId, model })
    .withGraphFetched('[asset]');
  return gallery;
};

export const deleteGallery = async (id) => {
  const gallery = await Gallery.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.ASSET.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await gallery.$query().delete();
  return {
    message: APP_MESSAGE.ASSET.SUCESS_DELETE
  };
};
