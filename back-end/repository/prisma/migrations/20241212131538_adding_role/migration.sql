/*
  Warnings:

  - The primary key for the `_InterestToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_InterestToUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "_InterestToUser" DROP CONSTRAINT "_InterestToUser_AB_pkey";

-- AlterTable
ALTER TABLE "_participant" DROP CONSTRAINT "_participant_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_InterestToUser_AB_unique" ON "_InterestToUser"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_participant_AB_unique" ON "_participant"("A", "B");
