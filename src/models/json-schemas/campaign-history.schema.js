export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    campaignId: { type: 'integer' },
    messageId: { type: 'string' },
    victimId: { type: 'integer' },
    model: {
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
    }
  }
};
