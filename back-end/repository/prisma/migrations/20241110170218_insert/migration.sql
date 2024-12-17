-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterestToAccount" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_InterestToAccount_AB_unique" ON "_InterestToAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_InterestToAccount_B_index" ON "_InterestToAccount"("B");

-- AddForeignKey
ALTER TABLE "_InterestToAccount" ADD CONSTRAINT "_InterestToAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToAccount" ADD CONSTRAINT "_InterestToAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
