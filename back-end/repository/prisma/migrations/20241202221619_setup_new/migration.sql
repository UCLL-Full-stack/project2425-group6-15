/*
  Warnings:

  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_accountId_fkey";

-- AlterTable
ALTER TABLE "_InterestToAccount" ADD CONSTRAINT "_InterestToAccount_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_InterestToAccount_AB_unique";

-- DropTable
DROP TABLE "Participant";

-- CreateTable
CREATE TABLE "_participant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_participant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_participant_B_index" ON "_participant"("B");

-- AddForeignKey
ALTER TABLE "_participant" ADD CONSTRAINT "_participant_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participant" ADD CONSTRAINT "_participant_B_fkey" FOREIGN KEY ("B") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
