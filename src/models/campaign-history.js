import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/campaign-history.schema';

class Campaign extends BaseModel {
  static get tableName() {
    return Table.CAMPAIGN_HISTORY;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      campaign: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'campaign'),
        join: {
          from: `${Table.CAMPAIGN_HISTORY}.campaignId`,
          to: `${Table.CAMPAIGN}.id`
        }
      }
    };
  }
}

export default Campaign;
