import { Prisma, user } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import prisma from '../prisma/client';
import { ProductService } from './product_service';

export class VoucherService {
  static async create(
    voucherData : Prisma.voucherUncheckedCreateInput
    & {
      products?: Omit<Prisma.voucher_productUncheckedCreateInput, 'voucherId'>[]
    },
    actor?: Omit<user, 'password'>,
  ) {

    const existsVoucher = await prisma.voucher.findFirst({
      where: {
        deletedAt: null,
        status: 'OPEN',
        voucherId: voucherData.voucherId,
      },
    });

    if (existsVoucher) {
      throw new Error('Voucher is busy');
    }

    voucherData = {
      ...voucherData,
      createdAt: moment().toISOString(),
      createdBy: actor && actor.id,
    };

    const voucherProducts = voucherData.products;

    if (voucherProducts && voucherProducts.length > 0) {
      await Promise.all(voucherProducts.map(async (p) => {
        const findProduct = await ProductService.getById(p.productId);

        return findProduct;
      }));
    }

    delete voucherData.products;

    const createdVoucher = await prisma.voucher.create({
      data: voucherData,
      include: {
        products: true,
      },
    });

    if (voucherProducts && voucherProducts.length > 0) {
      await prisma.voucher_product.createMany({
        data: voucherProducts
          .map((p) => ({
            voucherId: createdVoucher.id,
            productId: p.productId,
            assignedBy: actor && actor.id,
            quantity: p.quantity,
          })),
      });

      const findVoucher = await prisma.voucher.findFirst({
        where: {
          deletedAt: null,
          id: createdVoucher.id,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!findVoucher) {
        throw httpStatus['404_MESSAGE'];
      }

      const totalPrice = findVoucher?.products.reduce((a, p) => a + Number(p.product.listPrice) * p.quantity, 0);

      const updatedVoucher = await this.updateById(findVoucher.id, {
        totalPrice,
      }, actor);

      return updatedVoucher;

    }

    return createdVoucher;

  }

  static async getPaginated(params: Prisma.voucherFindManyArgs) {

    const findVouchers = await prisma.voucher.findMany({
      skip: params.skip,
      take: params.take,
      where: { deletedAt: null },
    });

    const countVouchers = await prisma.voucher.count({
      where: { deletedAt: null },
    });

    return {
      count: countVouchers,
      rows: findVouchers,
    };
  }

  static async getById(id : string, args?: Prisma.voucherFindFirstArgs) {
    const findVoucher = await prisma.voucher.findFirst({
      ...args,
      where: { id, deletedAt: null },
    });

    if (!findVoucher) {
      throw httpStatus['404_MESSAGE'];
    }

    return findVoucher;
  }

  static async updateById(
    id : string,
    voucherData: Prisma.voucherUpdateInput,
    actor?: Omit<user, 'password'>,
  ) {
    const findUser = await prisma.voucher.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findUser) {
      throw httpStatus['404_MESSAGE'];
    }

    voucherData = {
      ...voucherData,
      updatedAt: moment().toISOString(),
      updatedBy: actor && actor.id,
    };

    const updatedVoucher = await prisma.voucher.update({
      where: { id },
      data: voucherData,
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedVoucher;
  }

  static async deleteById(id : string, actor?: Omit<user, 'password'>) {
    const findVoucher = await prisma.voucher.findFirst({
      where: { id, deletedAt: null },
    });

    if (!findVoucher) {
      throw httpStatus['404_MESSAGE'];
    }

    const voucherData = {
      deletedAt: moment().toISOString(),
      deletedBy: actor && actor.id,
    };

    await prisma.voucher.update({
      where: { id },
      data: voucherData,
    });
  }
}
