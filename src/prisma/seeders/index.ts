import { logger } from '../../utils/logger';
import prisma from '../client';
import adminUser from './admin_user_seed';

async function main() {
  await adminUser();
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
