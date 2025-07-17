-- CreateTable
CREATE TABLE "essaycard" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "kesalahan" TEXT[],
    "kelebihan" TEXT[],
    "masukan" TEXT[],

    CONSTRAINT "essaycard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "essaycard" ADD CONSTRAINT "essaycard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
