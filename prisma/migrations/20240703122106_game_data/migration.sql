-- CreateTable
CREATE TABLE "LanguageData" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "languageDataName" TEXT NOT NULL,
    "languageDataContent" TEXT NOT NULL,

    CONSTRAINT "LanguageData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LanguageData" ADD CONSTRAINT "LanguageData_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
