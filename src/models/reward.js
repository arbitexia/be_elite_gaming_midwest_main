import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/reward.schema';

class Reward extends BaseModel {
  static get tableName() {
    return Table.REWARD;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'location'),
        join: {
          from: `${Table.REWARD}.locationId`,
          to: `${Table.LOCATION}.id`
        }
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'product'),
        join: {
          from: `${Table.REWARD}.productId`,
          to: `${Table.PRODUCT}.id`
        }
      }
    };
  }
}

export default Reward;
