import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/email-template.schema';

class HashCode extends BaseModel {
  static get tableName() {
    return Table.HashCode;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {};
  }
}

export default HashCode;
