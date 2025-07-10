/*
  Warnings:

  - Added the required column `judulinterview` to the `interviewcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `interviewcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal` to the `interviewcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interviewcard" ADD COLUMN     "judulinterview" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL;
