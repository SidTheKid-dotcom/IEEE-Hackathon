-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "activity" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_activity_user_id" ON "Activity"("user_id");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
