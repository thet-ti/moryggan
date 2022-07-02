-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(2048) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `birth` DATETIME(0) NULL,
    `profileType` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `token` TEXT NULL,
    `deletedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL,
    `updatedAt` DATETIME(0) NULL,
    `createdBy` CHAR(36) NULL,
    `deletedBy` CHAR(36) NULL,
    `updatedBy` CHAR(36) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
