import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/user-coupon.schema';

class UserCoupon extends BaseModel {
  static get tableName() {
    return Table.USER_COUPON;
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
          from: `${Table.USER_COUPON}.userId`,
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default UserCoupon;
