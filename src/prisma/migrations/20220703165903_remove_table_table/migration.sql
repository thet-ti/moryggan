-- AlterTable
ALTER TABLE `device` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `qr_code` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `listPrice` DECIMAL(10, 2) NOT NULL,
    `photoUrl` VARCHAR(2048) NULL,
    `color` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(2048) NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher` (
    `id` VARCHAR(191) NOT NULL,
    `voucherId` INTEGER NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `totalPrice` DECIMAL(10, 2) NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher_product` (
    `voucherId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(191) NULL,
    `deletedAt` DATETIME(0) NULL,
    `deletedBy` CHAR(36) NULL,

    PRIMARY KEY (`voucherId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_product` ADD CONSTRAINT `voucher_product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_product` ADD CONSTRAINT `voucher_product_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `voucher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
