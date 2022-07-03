-- CreateTable
CREATE TABLE `qr_code` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activatedAt` DATETIME(0) NULL,
    `activatedBy` VARCHAR(191) NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL,
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,

    UNIQUE INDEX `qr_code_userId_key`(`userId`),
    UNIQUE INDEX `qr_code_activatedBy_key`(`activatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `OS` VARCHAR(191) NULL,
    `version` VARCHAR(191) NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL,
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `qr_code` ADD CONSTRAINT `qr_code_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qr_code` ADD CONSTRAINT `qr_code_activatedBy_fkey` FOREIGN KEY (`activatedBy`) REFERENCES `device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
