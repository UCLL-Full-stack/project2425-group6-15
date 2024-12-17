/*
  Warnings:

  - The primary key for the `_InterestToAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_InterestToAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'account';

-- AlterTable
ALTER TABLE "_InterestToAccount" DROP CONSTRAINT "_InterestToAccount_AB_pkey";

-- AlterTable
ALTER TABLE "_participant" DROP CONSTRAINT "_participant_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_InterestToAccount_AB_unique" ON "_InterestToAccount"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_participant_AB_unique" ON "_participant"("A", "B");
