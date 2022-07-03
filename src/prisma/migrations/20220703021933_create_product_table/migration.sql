-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `listPrice` DECIMAL(10, 2) NOT NULL,
    `photoUrl` VARCHAR(2048) NULL,
    `color` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL,
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
    `createdAt` DATETIME(0) NULL,
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,
    `updatedBy` CHAR(36) NULL,
    `updatedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
