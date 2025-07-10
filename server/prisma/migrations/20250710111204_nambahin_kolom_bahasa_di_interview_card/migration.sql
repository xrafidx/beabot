/*
  Warnings:

  - Added the required column `bahasa` to the `interviewcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interviewcard" ADD COLUMN     "bahasa" TEXT NOT NULL;
