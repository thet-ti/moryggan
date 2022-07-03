/* eslint-disable no-unused-vars */
import { user } from '@prisma/client';

declare global {
  namespace Express {
      interface Request{
          user: Omit<user, 'password'>
      }
  }
}
