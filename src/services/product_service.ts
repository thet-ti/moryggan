import { Prisma, user } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import prisma from '../prisma/client';
import { AwsService } from './aws_service';

export class ProductService {
  static async create(
    productData : Prisma.productUncheckedCreateInput & { photo?: string },
    actor?: Omit<user, 'password'>,
  ) {

    if (productData.categoryId) {
      const findCategory = await prisma.category.findFirst({
        where: {
          id: productData.categoryId,
        },
      });

      if (!findCategory) {
        throw Error('Category don\'t exists');
      }
    }

    if (productData.photo) {
      const { Location } = await AwsService.uploadBase64(productData.photo);

      productData.photoUrl = Location;
    }

    delete productData.photo;

    productData = {
      ...productData,
      createdAt: moment().toISOString(),
      createdBy: actor && actor.id,
    };

    const createdProduct = await prisma.product.create({
      data: productData,
    });

    return createdProduct;

  }

  static async getPaginated(params: Prisma.productFindManyArgs) {

    const findProducts = await prisma.product.findMany({
      skip: params.skip,
      take: params.take,
      where: { deletedAt: null },
    });

    const countProducts = await prisma.product.count({
      where: { deletedAt: null },
    });

    return {
      count: countProducts,
      rows: findProducts,
    };
  }

  static async getById(id : string, args?: Prisma.productFindFirstArgs) {
    const findProduct = await prisma.product.findFirst({
      ...args,
      where: { id, deletedAt: null },
    });

    if (!findProduct) {
      throw httpStatus['404_MESSAGE'];
    }

    return findProduct;
  }

  static async updateById(
    id : string,
    productData: Partial<Prisma.productUncheckedCreateInput> & { photo?: string},
    actor?: Omit<user, 'password'>,
  ) {
    const findProduct = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findProduct) {
      throw httpStatus['404_MESSAGE'];
    }

    if (productData.categoryId) {
      const findCategory = await prisma.category.findFirst({
        where: {
          id: productData.categoryId,
        },
      });

      if (!findCategory) {
        throw Error('Category don\'t exists');
      }
    }

    if (productData.photo) {
      const { Location } = await AwsService.uploadBase64(productData.photo);

      productData.photoUrl = Location;
    }

    productData = {
      ...productData,
      updatedAt: moment().toISOString(),
      updatedBy: actor && actor.id,
    };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });

    return updatedProduct;
  }

  static async deleteById(id : string, actor?: Omit<user, 'password'>) {
    const findProduct = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findProduct) {
      throw httpStatus['404_MESSAGE'];
    }

    const productData = {
      deletedAt: moment().toISOString(),
      deletedBy: actor && actor.id,
    };

    await prisma.product.update({
      where: { id },
      data: productData,
    });
  }
}
