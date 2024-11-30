/*
  Warnings:

  - You are about to drop the column `accepted` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `status` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';