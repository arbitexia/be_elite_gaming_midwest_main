export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    model: {
      type: 'string',
      enum: [
        'ACTIVITY',
        'USER',
        'CONFIG',
        'EMAIL_TEMPLATE',
        'ASSET',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'TABLET',
        'VERIFICATION',
        'REWARD',
        'TRANSACTION'
      ]
    },
    field: { type: 'string' },
    description: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['PENDING', 'PUBLISHED', 'ARCHIVED']
    }
  }
};
