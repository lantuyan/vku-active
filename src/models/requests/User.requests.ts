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
  date_of_birth: string;
}

export interface LogoutRequestBody {
  refresh_token: string;
}

export interface VerifyEmailRequestBody {
  email_verify_token?: string;
}
export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
}
