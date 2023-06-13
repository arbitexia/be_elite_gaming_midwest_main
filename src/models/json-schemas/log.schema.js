export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    victimId: { type: 'integer' },
    logModel: {
      type: 'string',
      enum: [
        'ASSET',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'USER',
        'VERIFICATION',
        'EMAIL_TEMPLATE',
        'REWARD',
        'TRANSACTION',
        'TABLET'
      ]
    },
    logType: {
      type: 'string'
    },
    metadata: { type: 'object' }
  }
};
