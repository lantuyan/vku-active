import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { TokenType } from '~/constants/enum';
import { USERS_MESSAGES } from '~/constants/messages';
import { RegisterRequestBody } from '~/models/requests/User.requests';
import RefreshToken from '~/models/schemas/RefreshToken.schema';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';
import { hashPassword } from '~/utils/crypto';
import { signToken } from '~/utils/jwt';

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    });
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    });
  }

  private signAcessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)]);
  }

  async register(payload: RegisterRequestBody) {
    // const { email, password } = payload;
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    );

    const user_id = result.insertedId.toString();
    const [access_token, refresh_token] = await this.signAcessAndRefreshToken(user_id);

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    );
    // const [access_token, refresh_token] = await Promise.all([
    //   this.signAccessToken(user_id),
    //   this.signRefreshToken(user_id)
    // ]);

    return {
      access_token,
      refresh_token
    };
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    console.log(user);
    return Boolean(user);
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAcessAndRefreshToken(user_id);
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    );
    console.log('login');

    return {
      access_token,
      refresh_token
    };
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    console.log(result);
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    };
  }
}

const userService = new UsersService();
export default userService;
