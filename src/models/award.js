import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/award.schema';

class UserLocation extends BaseModel {
  static get tableName() {
    return Table.AWARD;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      userLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user-location'),
        join: {
          from: `${Table.AWARD}.userLocationId`,
          to: `${Table.USER_LOCATION}.id`
        }
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'product'),
        join: {
          from: `${Table.AWARD}.productId`,
          to: `${Table.PRODUCT}.id`
        }
      },
      assignee: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.AWARD}.assigneeId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default UserLocation;
