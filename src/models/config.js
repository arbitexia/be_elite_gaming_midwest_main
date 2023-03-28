import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/role.schema';

class Config extends BaseModel {
  static get tableName() {
    return Table.CONFIG;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {};
  }
}

export default Config;
