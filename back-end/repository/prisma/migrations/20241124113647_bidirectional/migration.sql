/*
  Warnings:

  - You are about to drop the `_postjoiners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_postjoiners" DROP CONSTRAINT "_postjoiners_A_fkey";

-- DropForeignKey
ALTER TABLE "_postjoiners" DROP CONSTRAINT "_postjoiners_B_fkey";

-- DropTable
DROP TABLE "_postjoiners";

-- CreateTable
CREATE TABLE "PostUser" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PostUser_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
