import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/user-location.schema';

class UserLocation extends BaseModel {
  static get tableName() {
    return Table.USER_LOCATION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      point: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'point'),
        join: {
          from: `${Table.USER_LOCATION}.id`,
          to: `${Table.POINT}.userLocationId`
        }
      },
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'location'),
        join: {
          from: `${Table.USER_LOCATION}.locationId`,
          to: `${Table.LOCATION}.id`
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.USER_LOCATION}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default UserLocation;
