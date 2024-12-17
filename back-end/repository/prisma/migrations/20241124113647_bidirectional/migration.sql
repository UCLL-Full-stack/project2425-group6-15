/*
  Warnings:

  - You are about to drop the `_eventjoiners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_eventjoiners" DROP CONSTRAINT "_eventjoiners_A_fkey";

-- DropForeignKey
ALTER TABLE "_eventjoiners" DROP CONSTRAINT "_eventjoiners_B_fkey";

-- DropTable
DROP TABLE "_eventjoiners";

-- CreateTable
CREATE TABLE "EventAccount" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "EventAccount_pkey" PRIMARY KEY ("eventId","accountId")
);

-- AddForeignKey
ALTER TABLE "EventAccount" ADD CONSTRAINT "EventAccount_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAccount" ADD CONSTRAINT "EventAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
