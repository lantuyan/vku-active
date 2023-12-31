import { JwtPayload } from 'jsonwebtoken';
import { TokenType } from '~/constants/enum';

export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface RegisterRequestBody {
  name: string;
  msv: string;
  email: string;
  password: string;
  confirmPassword: string;
  // date_of_birth: string;
}

export interface LogoutRequestBody {
  refresh_token: string;
}

export interface ForgotPasswordRequestBody {
  _id: string;
}

export interface VerifyEmailRequestBody {
  email_verify_token?: string;
}

export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string;
}

export interface UpdateUserRequestBody {
  name?: string;
  msv?: string;
  class?: string;
  date_of_birth?: string;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
}

export interface ActivityRequestBody {
  code: string;
  userLatitude?: string;
  userLongitude?: string;
}
