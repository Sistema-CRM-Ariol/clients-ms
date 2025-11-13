/*
  Warnings:

  - You are about to drop the column `departament` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "departament",
DROP COLUMN "province",
ADD COLUMN     "city" TEXT,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "invoice" DROP NOT NULL,
ALTER COLUMN "nit" DROP NOT NULL;
