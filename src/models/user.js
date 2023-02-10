import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/user.schema';

class User extends BaseModel {
  static get tableName() {
    return Table.USER;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get virtualAttributes() {
    return ['fullName', 'fullAddress'];
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  fullAddress() {
    return `${this.location?.address1 ?? ''} ${this.location?.address2 ?? ''} ${
      this.location?.city ?? ''
    } ${this.location?.state ?? ''} ${this.location?.zipcode ?? ''} ${
      this.location?.country ?? ''
    }`;
  }

  static get relationMappings() {
    return {
      avatar: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'asset'),
        join: {
          from: `${Table.USER}.assetId`,
          to: `${Table.ASSET}.id`
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'role'),
        join: {
          from: `${Table.USER}.roleId`,
          to: `${Table.ROLE}.id`
        }
      },
      userLocations: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'user-location'),
        join: {
          from: `${Table.USER}.id`,
          to: `${Table.USER_LOCATION}.userId`
        }
      }
    };
  }
}

export default User;
