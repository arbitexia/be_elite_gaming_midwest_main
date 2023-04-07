import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/award.schema';

class Transaction extends BaseModel {
  static get tableName() {
    return Table.TRANSACTION;
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
          from: `${Table.TRANSACTION}.userId`,
          to: `${Table.USER}.id`
        }
      },
      reward: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'reward'),
        join: {
          from: `${Table.TRANSACTION}.rewardId`,
          to: `${Table.REWARD}.id`
        }
      },
      location: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'location'),
        join: {
          from: `${Table.TRANSACTION}.locationId`,
          to: `${Table.LOCATION}.id`
        }
      },
      assignee: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.TRANSACTION}.assigneeId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Transaction;
