/*
  Warnings:

  - You are about to drop the `UserJoinedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserJoinedPost" DROP CONSTRAINT "UserJoinedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserJoinedPost" DROP CONSTRAINT "UserJoinedPost_userId_fkey";

-- DropTable
DROP TABLE "UserJoinedPost";

-- CreateTable
CREATE TABLE "_postjoiners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_postjoiners_AB_unique" ON "_postjoiners"("A", "B");

-- CreateIndex
CREATE INDEX "_postjoiners_B_index" ON "_postjoiners"("B");

-- AddForeignKey
ALTER TABLE "_postjoiners" ADD CONSTRAINT "_postjoiners_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_postjoiners" ADD CONSTRAINT "_postjoiners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
