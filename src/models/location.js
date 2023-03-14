import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/location.schema';

class Location extends BaseModel {
  static get tableName() {
    return Table.LOCATION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      userLocation: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'user-location'),
        join: {
          from: `${Table.LOCATION}.id`,
          to: `${Table.USER_LOCATION}.locationId`
        }
      },
      gallery: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'gallery'),
        join: {
          from: `${Table.LOCATION}.id`,
          to: `${Table.GALLERY}.victimId`
        }
      },
      reward: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'reward'),
        join: {
          from: `${Table.LOCATION}.id`,
          to: `${Table.REWARD}.locationId`
        }
      }
    };
  }
}

export default Location;
