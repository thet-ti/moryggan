import express, { NextFunction, Request, Response } from 'express';
import http from 'http-status';
import { PaginationHelper } from '../utils/paginations';
import { UserService } from '../services/user_service';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await UserService.create(req.body);

    return res.status(http.OK).json(createdUser);
  } catch (error) {
    if (error === http['409_MESSAGE']) {
      return res.sendStatus(http.CONFLICT);
    }

    return next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findUsers = await UserService.getPaginated(PaginationHelper({
      pageSize: req.query.pageSize,
      page: req.query.page,
    }));

    return res.status(http.OK).json(findUsers);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const findUser = await UserService.getById(req.params.id);

    return res.status(http.OK).json(findUser);
  } catch (error) {

    if (error === http['404_MESSAGE']) {
      return res.sendStatus(http.NOT_FOUND);
    }

    return next(error);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await UserService.updateById(req.params.id, req.body);

    return res.status(http.OK).json(updatedUser);
  } catch (error) {

    if (error === http['404_MESSAGE']) {
      return res.sendStatus(http.NOT_FOUND);
    }

    return next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.deleteById(req.params.id);

    return res.sendStatus(http.OK);
  } catch (error) {

    if (error === http['404_MESSAGE']) {
      return res.sendStatus(http.NOT_FOUND);
    }

    return next(error);
  }
});

export default router;
