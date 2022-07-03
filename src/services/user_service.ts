import { Prisma, user } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import prisma, { excludeFields } from '../prisma/client';
import { env } from '../utils/env';
import { HashService } from '../utils/hash';

export class UserService {
  static async create(
    userData : Prisma.userCreateInput,
    actor?: Omit<user, 'password'>,
  ) : Promise<Omit<user, 'password'>> {

    const findUser = await prisma.user.findFirst({
      where: { email: userData.email, deletedAt: null },
    });

    if (findUser) {
      throw httpStatus['409_MESSAGE'];
    }

    userData = {
      ...userData,
      password: await HashService.genHash(userData.password),
      createdAt: moment().toISOString(),
      createdBy: actor && actor.id,
    };

    const createdUser = await prisma.user.create({
      data: userData,
      select: excludeFields('User', ['password']),
    });

    const token = jwt.sign({ id: createdUser.id }, env.JWT_SECRET, {
      expiresIn: 86400, // 24h in seconds
    });

    await UserService.updateById(createdUser.id, {
      token,
    });

    await prisma.qr_code.create({
      data: {
        createdAt: moment().toISOString(),
        createdBy: actor && actor.id,
        userId: createdUser.id,
      },
    });

    return createdUser;

  }

  static async getPaginated(params: Prisma.userFindManyArgs) {

    const findUsers = await prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      select: excludeFields('User', ['password']),
      where: { deletedAt: null },
    });

    return findUsers;
  }

  static async getById(id : string, args?: Prisma.userFindFirstArgs) {
    const findUser = await prisma.user.findFirst({
      ...args,
      where: { id, deletedAt: null },
      select: {
        ...excludeFields('User', ['password']),
        qr_code: {
          include: {
            device: true,
          },
        },
      },
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    return findUser;
  }

  static async updateById(id : string, userData: Prisma.userUpdateInput, actor?: Omit<user, 'password'>) {
    const findUser = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: excludeFields('User', ['password']),
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    userData = {
      ...userData,
      updatedAt: moment().toISOString(),
      updatedBy: actor && actor.id,
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      select: excludeFields('User', ['password']),
    });

    return updatedUser;
  }

  static async deleteById(id : string, actor?: Omit<user, 'password'>) {
    const findUser = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: excludeFields('User', ['password']),
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    const userData = {
      deletedAt: moment().toISOString(),
      deletedBy: actor && actor.id,
    };

    await prisma.user.update({
      where: { id },
      data: userData,
      select: excludeFields('User', ['password']),
    });
  }

}
