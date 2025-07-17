/*
  Warnings:

  - You are about to drop the column `judul` on the `essaycard` table. All the data in the column will be lost.
  - You are about to drop the column `kelebihan` on the `essaycard` table. All the data in the column will be lost.
  - You are about to drop the column `kesalahan` on the `essaycard` table. All the data in the column will be lost.
  - You are about to drop the column `masukan` on the `essaycard` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `essaycard` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `essaycard` table. All the data in the column will be lost.
  - Added the required column `aireview` to the `essaycard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "essaycard" DROP COLUMN "judul",
DROP COLUMN "kelebihan",
DROP COLUMN "kesalahan",
DROP COLUMN "masukan",
DROP COLUMN "rating",
DROP COLUMN "tanggal",
ADD COLUMN     "aireview" JSONB NOT NULL;
