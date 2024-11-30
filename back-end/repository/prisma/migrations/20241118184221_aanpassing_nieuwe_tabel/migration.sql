/*
  Warnings:

  - You are about to drop the `_UserAcceptedPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserJoinedPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserAcceptedPosts" DROP CONSTRAINT "_UserAcceptedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserAcceptedPosts" DROP CONSTRAINT "_UserAcceptedPosts_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserJoinedPosts" DROP CONSTRAINT "_UserJoinedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserJoinedPosts" DROP CONSTRAINT "_UserJoinedPosts_B_fkey";

-- DropTable
DROP TABLE "_UserAcceptedPosts";

-- DropTable
DROP TABLE "_UserJoinedPosts";

-- CreateTable
CREATE TABLE "UserJoinedPost" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "UserJoinedPost_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "UserJoinedPost" ADD CONSTRAINT "UserJoinedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJoinedPost" ADD CONSTRAINT "UserJoinedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
