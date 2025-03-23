/*
  Warnings:

  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `appointment_userId_fkey`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `date` DATETIME(3) NOT NULL,
    MODIFY `time` VARCHAR(191) NOT NULL,
    MODIFY `department` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_citizenId_key` TO `User_citizenId_key`;
