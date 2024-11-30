/*
  Warnings:

  - You are about to drop the column `accepted` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "accepted",
ALTER COLUMN "status" DROP DEFAULT;
