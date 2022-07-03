import { Prisma, user } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import prisma from '../prisma/client';
import { AwsService } from './aws_service';

export class CategoryService {
  static async create(
    categoryData : Prisma.categoryCreateInput & { photo?: string },
    actor?: Omit<user, 'password'>,
  ) {

    if (categoryData.photo) {
      const { Location } = await AwsService.uploadBase64(categoryData.photo);

      categoryData.photoUrl = Location;
    }

    delete categoryData.photo;

    categoryData = {
      ...categoryData,
      createdAt: moment().toISOString(),
      createdBy: actor && actor.id,
    };

    const createdCategory = await prisma.category.create({
      data: categoryData,
    });

    return createdCategory;

  }

  static async getPaginated(params: Prisma.categoryFindManyArgs) {

    const findCategories = await prisma.category.findMany({
      skip: params.skip,
      take: params.take,
      where: { deletedAt: null },
    });

    const countCategories = await prisma.category.count({
      where: { deletedAt: null },
    });

    return {
      count: countCategories,
      rows: findCategories,
    };
  }

  static async getById(id : string, args?: Prisma.categoryFindFirstArgs) {
    const findCategory = await prisma.category.findFirst({
      ...args,
      where: { id, deletedAt: null },
    });

    if (!findCategory) {
      throw httpStatus['404_MESSAGE'];
    }

    return findCategory;
  }

  static async updateById(
    id : string,
    categoryData: Prisma.categoryUpdateInput & { photo?: string},
    actor?: Omit<user, 'password'>,
  ) {
    const findUser = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    if (categoryData.photo) {
      const { Location } = await AwsService.uploadBase64(categoryData.photo);

      categoryData.photoUrl = Location;
    }

    categoryData = {
      ...categoryData,
      updatedAt: moment().toISOString(),
      updatedBy: actor && actor.id,
    };

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: categoryData,
    });

    return updatedCategory;
  }

  static async deleteById(id : string, actor?: Omit<user, 'password'>) {
    const findCategory = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findCategory) {
      throw httpStatus['404_MESSAGE'];
    }

    const categoryData = {
      deletedAt: moment().toISOString(),
      deletedBy: actor && actor.id,
    };

    await prisma.category.update({
      where: { id },
      data: categoryData,
    });
  }
}
