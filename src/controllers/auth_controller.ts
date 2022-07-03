import express, { NextFunction, Request, Response } from 'express';
import http from 'http-status';
import { authenticator } from '../middlewares/authenticator';
import { AuthServices } from '../services/auth_service';

const router = express.Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdUser = await AuthServices.login(req.body);

      return res.status(http.OK).json(createdUser);
    } catch (error) {
      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      if (error === http['401_MESSAGE']) {
        return res.sendStatus(http.UNAUTHORIZED);
      }

      return next(error);
    }
  },
);

router.get(
  '/me',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedUser = req.user;

      if (!loggedUser) {
        return res.sendStatus(http.UNAUTHORIZED);

      }

      return res.status(http.OK).json(loggedUser);
    } catch (error) {
      return next(error);
    }
  },
);

router.get(
  '/qr/:userId',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdUser = await AuthServices.qrGenerate(req.params.userId);

      return res.status(http.OK).json(createdUser);
    } catch (error) {
      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      if (error === http['401_MESSAGE']) {
        return res.sendStatus(http.UNAUTHORIZED);
      }

      return next(error);
    }
  },
);

router.post(
  '/qr/validation',
  async (req: Request, res: Response) => {
    try {
      const createdUser = await AuthServices.qrValidation(req.body.token);

      return res.status(http.OK).json(createdUser);
    } catch (error) {
      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      if (error === http['403_MESSAGE']) {
        return res.sendStatus(http.FORBIDDEN);
      }

      return res.sendStatus(http.UNAUTHORIZED);
    }
  },
);

export default router;
