import path from 'path';
import { Model } from 'objection';
import { Table } from '@/database/common';
import BaseModel from './__base';
import jsonSchema from './json-schemas/product.schema';

class Product extends BaseModel {
  static get tableName() {
    return Table.PRODUCT;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      gallery: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'gallery'),
        join: {
          from: `${Table.PRODUCT}.id`,
          to: `${Table.GALLERY}.victimId`
        }
      }
    };
  }
}

export default Product;
