/*
  Warnings:

  - You are about to drop the `Correos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Telefonos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Correos" DROP CONSTRAINT "Correos_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Telefonos" DROP CONSTRAINT "Telefonos_clienteId_fkey";

-- AlterTable
ALTER TABLE "Clientes" ADD COLUMN     "correos" TEXT[],
ADD COLUMN     "telefonos" TEXT[];

-- DropTable
DROP TABLE "Correos";

-- DropTable
DROP TABLE "Telefonos";
