import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/gallery.schema';

class Gallery extends BaseModel {
  static get tableName() {
    return Table.GALLERY;
  }

  static get modifiers() {
    return {
      location(builder) {
        builder.where('model', 'LOCATION');
      },

      product(builder) {
        builder.where('model', 'PRODUCT');
      }
    };
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      asset: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'asset'),
        join: {
          from: `${Table.GALLERY}.assetId`,
          to: `${Table.ASSET}.id`
        }
      },
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'asset'),
        join: {
          from: `${Table.GALLERY}.assetId`,
          to: `${Table.ASSET}.id`
        }
      }
    };
  }
}

export default Gallery;
