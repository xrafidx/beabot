-- CreateTable
CREATE TABLE "blacklist" (
    "jti" TEXT NOT NULL,
    "expiresat" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_jti_key" ON "blacklist"("jti");
