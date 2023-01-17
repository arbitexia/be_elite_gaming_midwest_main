import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/asset.schema';

class Asset extends BaseModel {
  static get tableName() {
    return Table.ASSET;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      avatars: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.ASSET}.id`,
          to: `${Table.USER}.assetId`
        }
      },
      gallery: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'gallery'),
        join: {
          from: `${Table.ASSET}.id`,
          to: `${Table.GALLERY}.assetId`
        }
      }
    };
  }
}

export default Asset;
