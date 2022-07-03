import { NextFunction, Request, Response } from 'express';
import http from 'http-status';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user_service';
import { env } from '../utils/env';

interface IncomingHttpHeaders {
  'authorization'?: string;
  [header: string]: string | string[] | undefined;
}

interface IJwtProps {
  id: string;
}

export const authenticator = async (req : Request, res: Response, next: NextFunction) => {
  const { authorization: token } : IncomingHttpHeaders = req.headers;

  try {

    if (token) {
      const { id } = jwt.verify(token.split(' ')[1], env.JWT_SECRET) as IJwtProps;

      const findUser = await UserService.getById(id);

      if (findUser.token === token.split(' ')[1]) {
        req.user = findUser;

        return next();
      }

      throw http['401_MESSAGE'];

    }

    throw http['403_MESSAGE'];

  } catch (error) {

    if (error === http['403_MESSAGE']) {
      return res.sendStatus(http.FORBIDDEN);
    }

    return res.sendStatus(http.UNAUTHORIZED);

  }
};
