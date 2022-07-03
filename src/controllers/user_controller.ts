import express, { NextFunction, Request, Response } from 'express';
import http from 'http-status';
import { PaginationHelper } from '../utils/paginations';
import { UserService } from '../services/user_service';
import { authenticator } from '../middlewares/authenticator';

const router = express.Router();

router.post(
  '/',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdUser = await UserService.create(req.body, req.user);

      return res.status(http.OK).json(createdUser);
    } catch (error) {
      if (error === http['409_MESSAGE']) {
        return res.sendStatus(http.CONFLICT);
      }

      return next(error);
    }
  },
);

router.get(
  '/',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUsers = await UserService.getPaginated(PaginationHelper({
        pageSize: req.query.pageSize,
        page: req.query.page,
      }));

      return res.status(http.OK).json(findUsers);
    } catch (error) {
      return next(error);
    }
  },
);

router.get(
  '/:id',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUser = await UserService.getById(req.params.id);

      return res.status(http.OK).json(findUser);
    } catch (error) {

      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      return next(error);
    }
  },
);

router.patch(
  '/:id',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await UserService.updateById(req.params.id, req.body, req.user);

      return res.status(http.OK).json(updatedUser);
    } catch (error) {

      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      return next(error);
    }
  },
);

router.delete(
  '/:id',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserService.deleteById(req.params.id, req.user);

      return res.sendStatus(http.OK);
    } catch (error) {

      if (error === http['404_MESSAGE']) {
        return res.sendStatus(http.NOT_FOUND);
      }

      return next(error);
    }
  },
);

export default router;
