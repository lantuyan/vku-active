// Mở rộng thêm 1 interface cho Request của express
import { Request } from 'express';
import User from '~/models/schemas/User.schema';
declare module 'express' {
  interface Request {
    user?: User;
  }
}
