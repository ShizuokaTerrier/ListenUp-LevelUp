/*
  Warnings:

  - The `languageDataContent` column on the `LanguageData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LanguageData" DROP COLUMN "languageDataContent",
ADD COLUMN     "languageDataContent" TEXT[];
