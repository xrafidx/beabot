-- CreateTable
CREATE TABLE "interviewcard" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "namabeasiswa" TEXT NOT NULL,
    "banyakpertanyaan" INTEGER NOT NULL,
    "jenisinterview" TEXT NOT NULL,

    CONSTRAINT "interviewcard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "interviewcard" ADD CONSTRAINT "interviewcard_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
