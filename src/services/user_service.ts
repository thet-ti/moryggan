import { Prisma, user } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import prisma, { excludeFields } from '../prisma/client';
import { HashService } from '../utils/hash';

export class UserService {
  static async create(userData : Prisma.userCreateInput) : Promise<Omit<user, 'password'>> {

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
      // createdBy: actor.id
    };

    const createdUser = await prisma.user.create({
      data: userData,
      select: excludeFields('User', ['password']),
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

  static async getById(id : string) {
    const findUser = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: excludeFields('User', ['password']),
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    return findUser;
  }

  static async updateById(id : string, userData: Prisma.userUpdateInput) {
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
      // updatedBy: actor.id
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      select: excludeFields('User', ['password']),
    });

    return updatedUser;
  }

  static async deleteById(id : string) {
    const findUser = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: excludeFields('User', ['password']),
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    const userData = {
      deletedAt: moment().toISOString(),
      // deletedAt: actor.id
    };

    await prisma.user.update({
      where: { id },
      data: userData,
      select: excludeFields('User', ['password']),
    });
  }

}
