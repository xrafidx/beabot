/*
  Warnings:

  - You are about to drop the column `rating` on the `interviewcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interviewcard" DROP COLUMN "rating",
ADD COLUMN     "imageurl" TEXT;

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "cardsid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "nilaikejelasan" INTEGER NOT NULL,
    "nilairelevansi" INTEGER NOT NULL,
    "nilaibahasa" INTEGER NOT NULL,
    "nilaikelancaran" INTEGER NOT NULL,
    "strengths" TEXT NOT NULL,
    "improvement" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feedback_cardsid_key" ON "feedback"("cardsid");

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_cardsid_fkey" FOREIGN KEY ("cardsid") REFERENCES "interviewcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
