import express, { NextFunction, Request, Response } from 'express';
import http from 'http-status';
import { authenticator } from '../middlewares/authenticator';
import { ProductService } from '../services/product_service';
import { PaginationHelper } from '../utils/paginations';

const router = express.Router();

router.post(
  '/',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdUser = await ProductService.create(req.body, req.user);

      return res.status(http.OK).json(createdUser);
    } catch (error) {
      return next(error);
    }
  },
);

router.get(
  '/',
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUsers = await ProductService.getPaginated(PaginationHelper({
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
      const findUser = await ProductService.getById(req.params.id);

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
      const updatedUser = await ProductService.updateById(req.params.id, req.body, req.user);

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
      await ProductService.deleteById(req.params.id, req.user);

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
