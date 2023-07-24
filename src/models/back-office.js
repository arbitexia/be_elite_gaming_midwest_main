import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/back-office.schema';

class BackOffice extends BaseModel {
  static get tableName() {
    return Table.BACK_OFFICE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {};
  }
}

export default BackOffice;
