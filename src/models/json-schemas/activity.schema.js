export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    victimId: { type: 'integer' },
    model: {
      type: 'string',
      enum: [
        'ASSET',
        'AWARD',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'USER',
        'VERIFICATION',
        'EMAIL_TEMPLATE',
        'REWARD'
      ]
    },
    type: {
      type: 'string',
      enum: ['CREATE', 'UPDATE', 'DELETE', 'CHECKIN', 'SIGNUP', 'LOGIN', 'GET', 'VIEW']
    },
    metadata: { type: 'object' }
  }
};
