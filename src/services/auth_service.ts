import { user } from '@prisma/client';
import http from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import QR from 'qrcode';
import prisma from '../prisma/client';
import { env } from '../utils/env';
import { HashService } from '../utils/hash';
import { UserService } from './user_service';

interface ILoginProps {
  email: string;
  password: string;
}

interface IJwtProps {
  id: string;
  userId: string;
}

export class AuthServices {
  static async login({ email, password } : ILoginProps) : Promise<Omit<user, 'password'>> {

    const findUser = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!findUser) {
      throw http['404_MESSAGE'];
    }

    const passwordIsValid = HashService.validateHash(password, findUser.password);

    if (!passwordIsValid) {
      throw http['401_MESSAGE'];
    }

    const token = jwt.sign({ id: findUser.id }, env.JWT_SECRET, {
      expiresIn: 86400, // 24h in seconds
    });

    const updatedUser = await UserService.updateById(findUser.id, {
      token,
    });

    return updatedUser;

  }

  static async qrGenerate(userId: string) : Promise<String> {

    const findQr = await prisma.qr_code.findFirst({
      where: { userId, deletedAt: null, activatedAt: null },
    });

    if (!findQr) {
      throw http['404_MESSAGE'];
    }

    const qrToken = jwt.sign({
      id: findQr.id,
      userId: findQr.userId,
    }, env.JWT_QR_SECRET);

    const qrCode = await QR.toDataURL(qrToken);

    return qrCode;

  }

  static async qrValidation(token: string) : Promise<Omit<user, 'password'>> {
    const { id, userId } = jwt.verify(token, env.JWT_QR_SECRET) as IJwtProps;

    const findQrCode = await prisma.qr_code.findFirst({
      where: { userId, id, deletedAt: null },
    });

    if (!findQrCode) {
      throw http['404_MESSAGE'];
    }

    if (findQrCode.deletedAt) {
      throw http['403_MESSAGE'];
    }

    if (!findQrCode.activatedAt) {
      const createdDevice = await prisma.device.create({
        data: {
          version: 'Fazer implementação',
        },
      });

      await prisma.qr_code.update({
        where: { id },
        data: {
          activatedBy: createdDevice.id,
          activatedAt: moment().toISOString(),
        },
      });
    }

    const findUser = await UserService.getById(userId);

    return findUser;

  }

  static async qrReset(userId : string, actor: Omit<user, 'password'>) {
    const updatedQrCode = await prisma.qr_code.update({
      where: { userId },
      data: {
        deletedAt: moment().toISOString(),
        deletedBy: actor.id,
      },
      include: {
        device: true,
      },
    });

    await prisma.device.update({
      where: {
        id: updatedQrCode.id,
      },
      data: {
        deletedAt: moment().toISOString(),
        deletedBy: actor.id,
      },
    });
  }
}
