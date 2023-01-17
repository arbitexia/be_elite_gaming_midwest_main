import uniqid from 'uniqid';
import config from '@/config';
import { AWSProvider } from '@/provider';
import { Asset, Gallery } from '@/models';

export const createUploadForm = (fileName) => {
  const s3Key = `assets/${uniqid()}_${fileName}`;
  const awsProvider = new AWSProvider();
  return awsProvider.createPresignedPostData(fileName, config.AWS.S3_ASSET_BUCKET, s3Key);
};

export const createAsset = async (input) => {
  const asset = await Asset.query().insertAndFetch({ ...input });
  return asset;
};

export const createGallery = async (input) => {
  const gallery = await Gallery.query().insertAndFetch({ ...input });
  return gallery;
};
