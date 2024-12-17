/*
  Warnings:

  - You are about to drop the `AccountJoinedEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountJoinedEvent" DROP CONSTRAINT "AccountJoinedEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "AccountJoinedEvent" DROP CONSTRAINT "AccountJoinedEvent_accountId_fkey";

-- DropTable
DROP TABLE "AccountJoinedEvent";

-- CreateTable
CREATE TABLE "_eventjoiners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_eventjoiners_AB_unique" ON "_eventjoiners"("A", "B");

-- CreateIndex
CREATE INDEX "_eventjoiners_B_index" ON "_eventjoiners"("B");

-- AddForeignKey
ALTER TABLE "_eventjoiners" ADD CONSTRAINT "_eventjoiners_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventjoiners" ADD CONSTRAINT "_eventjoiners_B_fkey" FOREIGN KEY ("B") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
