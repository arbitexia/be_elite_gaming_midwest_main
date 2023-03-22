import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/activity.schema';

class Activity extends BaseModel {
  static get tableName() {
    return Table.ACTIVITY;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.ACTIVITY}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Activity;
