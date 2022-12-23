/* eslint-disable max-len */
const APP_MESSAGE = {
  COMMON: {
    NOT_FOUND: 'Not found!',
    ACCESS_FORBIDDEN: 'Permission required to process the current request',
    INVALID_SCHEMA: 'Invalid schema name, needs to register the schema'
  },
  AUTH: {
    SEND_VERIFY: 'Send SMS Verification code',
    DUPLICATED_EMAIL: 'Current email address already exists!',
    SUCCESS_REGISTER: 'Successfully, the profile has been created!',
    NOT_FOUND_USER: 'Current user does not exist. Plz check your credentials.',
    INVALID_CREDENTIAL: 'Invalid credentials, Please try to login with correct one.',
    SUCCESS_VERIFY: 'Successfully, the profile has been verified!',
    SUCCESS_FORGOT_PASSWORD: 'Your request has been approved, Please check inbox on your email!',
    SUCCESS_RESET_PASSWORD: 'Successfully, processed your reset password request!'
  },
  VERIFICATION: {
    NOT_FOUND: 'Sorry we are not process your request with current token!',
    TOKEN_EXPIRED: 'Token has been expired. please contact to support team!'
  }
};

export default APP_MESSAGE;
