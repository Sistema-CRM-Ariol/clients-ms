-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_companyId_fkey";

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
