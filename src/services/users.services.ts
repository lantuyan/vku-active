import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { TokenType, UserVerifyStatus } from '~/constants/enum';
import { USERS_MESSAGES } from '~/constants/messages';
import { ActivityRequestBody, RegisterRequestBody, UpdateUserRequestBody } from '~/models/requests/User.requests';
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
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
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
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    });
  }
  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    });
  }

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    });
  }

  private signAcessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)]);
  }

  async register(payload: RegisterRequestBody) {
    // const { email, password } = payload;
    // Tạo user id bằng code để đưa vào trường email verify token
    const user_id = new ObjectId();
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString());
    // const result =
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        // date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    );

    // const user_id = result.insertedId.toString();
    const [access_token, refresh_token] = await this.signAcessAndRefreshToken(user_id.toString());

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

    console.log(email_verify_token);
    return {
      access_token,
      refresh_token
    };
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    // console.log(user);
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
    // console.log('login');

    return {
      access_token,
      refresh_token
    };
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    // console.log(result);
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    };
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAcessAndRefreshToken(user_id),
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: new Date() // cập nhật theo server
          }
          // $currentDate: {
          //   updated_at: true
          // } // Cập nhật updated_at thành ngày hiện tại theo MongoDB
        }
      )
    ]);
    console.log('verifyEmail');
    const [access_token, refresh_token] = token;
    return {
      access_token,
      refresh_token
    };
  }
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id);
    console.log('resendVerifyEmail: ', email_verify_token);

    // Update lại email_verify_token
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token,
          updated_at: new Date()
        }
      }
    );
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    };
  }

  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id);
    console.log('forgotPassword: ', forgot_password_token);
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token,
          updated_at: new Date()
        }
      }
    );
    // Send email link to user: https://localhost:3000/forgot-password?token=token
    console.log('forgot_password_tolen: ', forgot_password_token);
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_FORGOT_PASSWORD_SUCCESS
    };
  }

  async getUserInfo(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user;
  }

  async updateUserInfo(user_id: string, payload: UpdateUserRequestBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload;
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateUserRequestBody & { date_of_birth?: Date }),
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user.value;
  }

  async getActivityInfo(code: string) {
    const activity = await databaseService.activities.findOne(
      { code: code },
      {
        projection: {
          _id: 0,
          activityLatitude: 0,
          activityLongitude: 0
        }
      }
    );
    return activity;
  }

  async getAllActivityofUser(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          activities: 1
        }
      }
    );
    const arrayActivities = user?.activities;
    const result = await databaseService.activities
      .find(
        {
          code: {
            $in: arrayActivities
          }
        },
        {
          projection: {
            activityLatitude: 0,
            activityLongitude: 0
          }
        }
      )
      .toArray();
    return result;
  }

  async signActivity(user_id: string, code: any, score: number) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    const userScore = user?.totalScore || 0;
    const newScore = +userScore + +score;
    // console.log(`${userScore} + ${score} = ${newScore}`);
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $push: {
          activities: code
        },
        $set: {
          totalScore: newScore
        }
      }
    );
  }
}

const userService = new UsersService();
export default userService;
