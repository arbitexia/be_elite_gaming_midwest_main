import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/user.schema';

class Tablet extends BaseModel {
  static get tableName() {
    return Table.TABLET;
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
          from: `${Table.TABLET}.locationId`,
          to: `${Table.LOCATION}.id`
        }
      }
    };
  }
}

export default Tablet;
