import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/point.schema';

class Point extends BaseModel {
  static get tableName() {
    return Table.POINT;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      userLocation: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user-locations'),
        join: {
          from: `${Table.POINT}.userLocationId`,
          to: `${Table.USER_LOCATION}.id`
        }
      }
    };
  }
}

export default Point;
