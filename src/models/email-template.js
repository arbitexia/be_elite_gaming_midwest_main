import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/email-template.schema';

class EmailTemplate extends BaseModel {
  static get tableName() {
    return Table.EMAIL_TEMPLATE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {};
  }
}

export default EmailTemplate;
