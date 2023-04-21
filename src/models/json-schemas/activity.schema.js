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
    type: {
      type: 'string',
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'CHECKIN',
        'SIGNUP',
        'LOGIN',
        'GET',
        'VIEW',
        'REQUEST',
        'ACCEPT',
        'DECLINE'
      ]
    },
    metadata: { type: 'object' }
  }
};
