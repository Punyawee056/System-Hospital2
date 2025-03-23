/*
  Warnings:

  - You are about to alter the column `date` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `time` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `department` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `date` DATETIME(0) NOT NULL,
    MODIFY `time` VARCHAR(20) NOT NULL,
    MODIFY `department` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `appointment` RENAME INDEX `Appointment_userId_fkey` TO `appointment_userId_fkey`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_citizenId_key` TO `citizenId`;
