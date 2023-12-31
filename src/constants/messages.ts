export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',

  NAME_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be string',
  NAME_LENGTH: 'Name must be between 3 and 100 characters',

  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',

  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',

  MSV_REQUIRED: 'MSV is required',
  MSV_MUST_BE_STRING: 'MSV must be string',
  MSV_LENGTH: 'MSV must be between 6 and 20 characters',

  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be string',
  PASSWORD_LENGTH: 'Password must be between 6 and 100 characters',
  PASSWORD_STRONG:
    'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',

  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be string',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be between 6 and 100 characters',
  CONFIRM_PASSWORD_STRONG:
    'Confirm password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  CONFIRM_PASSWORD_MUST_MATCH: 'Confirm password must match password',

  CLASS_MUST_BE_STRING: 'Class must be string',
  DATE_OF_BIRTH_MUST_BE_ISO08601: 'Date of birth must be ISO08601 format',

  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',

  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_INVALID: 'Access token is invalid',

  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  // USED_REFRESH_TOKEN_OR_NOT_FOUND: 'Used refresh token not found',
  REFRESH_TOKEN_USED_OR_NOT_EXISTS: 'Refresh token used or not exists',

  LOGOUT_SUCCESS: 'Logout success',

  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verifi token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  EMAIL_ALREADY_VERIFIED: 'Email already verified before',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',

  CHECK_EMAIL_FORGOT_PASSWORD_SUCCESS: 'Check email forgot password success',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',

  GET_USER_INFO_SUCCESS: 'Get user info success',
  UPDATE_USER_INFO_SUCCESS: 'Update user info success',

  GET_ACTIVITY_INFO_SUCCESS: 'Get activity info success',

  SIGN_ACTIVITY_SUCCESS: 'Sign activity success',

  CODE_REQUIRED: 'Code is required',
  CODE_MUST_BE_STRING: 'Code must be string',
  CODE_NOT_EXIST: 'Code not exist',
  CODE_IS_EXIST_BEFORE: 'Code is exist before',

  LATITUDE_REQUIRED: 'Latitude is required',
  LATITUDE_MUST_BE_STRING: 'Latitude must be number',

  LONGITUDE_REQUIRED: 'Longitude is required',
  LONGITUDE_MUST_BE_STRING: 'Longitude must be number',

  ACTIVITY_NOT_FOUND: 'Activity not found',
  ACTIVITY_TIME_OUT: 'Activity time out',
  ACTIVITY_ALREADY_IN_USER: 'Activity already in user',
  USER_NOT_CORRECT_LOCATION: 'User not correct location'
} as const;
