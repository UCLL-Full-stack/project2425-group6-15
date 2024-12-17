/*
  Warnings:

  - You are about to drop the `_AccountAcceptedEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccountJoinedEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccountAcceptedEvents" DROP CONSTRAINT "_AccountAcceptedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountAcceptedEvents" DROP CONSTRAINT "_AccountAcceptedEvents_B_fkey";

-- DropForeignKey
ALTER TABLE "_AccountJoinedEvents" DROP CONSTRAINT "_AccountJoinedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountJoinedEvents" DROP CONSTRAINT "_AccountJoinedEvents_B_fkey";

-- DropTable
DROP TABLE "_AccountAcceptedEvents";

-- DropTable
DROP TABLE "_AccountJoinedEvents";

-- CreateTable
CREATE TABLE "AccountJoinedEvent" (
    "accountId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "AccountJoinedEvent_pkey" PRIMARY KEY ("accountId","eventId")
);

-- AddForeignKey
ALTER TABLE "AccountJoinedEvent" ADD CONSTRAINT "AccountJoinedEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountJoinedEvent" ADD CONSTRAINT "AccountJoinedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
