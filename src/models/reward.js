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
}

export default Reward;
