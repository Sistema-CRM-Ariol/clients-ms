/*
  Warnings:

  - You are about to drop the column `invoice` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "invoice",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "razonSocial" TEXT;
