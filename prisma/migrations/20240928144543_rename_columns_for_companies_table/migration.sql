/*
  Warnings:

  - You are about to drop the `Empresas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_empresaId_fkey";

-- DropTable
DROP TABLE "Empresas";

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "direction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
