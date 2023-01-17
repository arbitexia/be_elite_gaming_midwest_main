export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    assetId: { type: 'integer' },
    victimId: { type: 'integer' },
    model: {
      type: 'string',
      enum: ['PRODUCT', 'LOCATION']
    }
  }
};
