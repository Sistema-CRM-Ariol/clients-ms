/*
  Warnings:

  - You are about to drop the column `emails` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `phones` on the `clients` table. All the data in the column will be lost.
  - Added the required column `email1` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone1` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "emails",
DROP COLUMN "phones",
ADD COLUMN     "email1" TEXT NOT NULL,
ADD COLUMN     "email2" TEXT,
ADD COLUMN     "phone1" TEXT NOT NULL,
ADD COLUMN     "phone2" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" SET NOT NULL;
