import moment from 'moment';
import prisma from '../client';
import { logger } from '../../utils/logger';
import { HashService } from '../../utils/hash';

export default async function adminUser() {

  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Usuário Administrador',
      password: await HashService.genHash('senha'),
      createdAt: moment().toISOString(),
    },
  });

  const qrCode = await prisma.qr_code.create({
    data: {
      createdAt: moment().toISOString(),
      userId: admin.id,
    },
  });

  logger.info(admin.id);
  logger.info(qrCode.id);
}
