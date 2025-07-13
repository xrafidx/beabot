-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "cardsid" INTEGER NOT NULL,
    "question" JSONB NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL,
    "essaydriven" BOOLEAN NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_cardsid_key" ON "question"("cardsid");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_cardsid_fkey" FOREIGN KEY ("cardsid") REFERENCES "interviewcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
