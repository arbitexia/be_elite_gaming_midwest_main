/* eslint-disable max-len */
const APP_MESSAGE = {
  COMMON: {
    NOT_FOUND: 'Not found!',
    ACCESS_FORBIDDEN: 'Permission required to process the current request',
    INVALID_SCHEMA: 'Invalid schema name, needs to register the schema'
  },
  AUTH: {
    SEND_AUTH_VERIFY: 'Send SMS Verification code for authorization',
    SEND_REGISTER_VERIFY: 'Send SMS Verification code for register',
    DUPLICATED_EMAIL: 'Current email address already exists!',
    DUPLICATED_PHONE: 'Current phonenumber already exists!',
    SUCCESS_REGISTER: 'Successfully, the profile has been created!',
    NOT_FOUND_USER: 'Current user does not exist. Plz check your credentials.',
    INVALID_CREDENTIAL: 'Invalid credentials, Please try to login with correct one.',
    SUCCESS_VERIFY: 'Successfully, the profile has been verified!',
    SUCCESS_FORGOT_PASSWORD: 'Your request has been approved, Please check inbox on your email!',
    SUCCESS_RESET_PASSWORD: 'Successfully, processed your reset password request!'
  },
  USER: {
    DISABLED: 'Current user has been archieved, required additional action to recover the profile.',
    NOT_FOUND: 'Current user does not exist!',
    ALREADY_DEFINED: 'Current parameter already set on the user.',
    INVALID_USER: 'Unable to process the not matched user!',
    INVALID_PASSWORD: 'Unable to process the update password!',
    SUCESS_PASSWORD_CHANGE: 'Successfully, Your password has been updated!',
    SUCESS_USER_DELETE: 'User has been deleted'
  },
  EMAIL_TEMPLATE: {
    NOT_FOUND: 'Email Template Not Found!'
  },
  VERIFICATION: {
    NOT_FOUND: 'Sorry we are not process your request with current token!',
    TOKEN_EXPIRED: 'Token has been expired. please contact to support team!'
  },
  LOCATION: {
    NOT_FOUND: 'Location does not exist!',
    SUCESS_DELETE: 'Location has been deleted'
  }
};

export default APP_MESSAGE;
