import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/campaign.schema';

class Campaign extends BaseModel {
  static get tableName() {
    return Table.CAMPAIGN;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {};
  }
}

export default Campaign;
