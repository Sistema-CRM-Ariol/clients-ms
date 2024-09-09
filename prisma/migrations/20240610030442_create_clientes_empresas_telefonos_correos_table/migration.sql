-- CreateTable
CREATE TABLE "Clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "factura" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "empresaId" TEXT,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "detalles" TEXT,
    "direccion" TEXT,

    CONSTRAINT "Empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Correos" (
    "id" SERIAL NOT NULL,
    "correo" TEXT NOT NULL,
    "clienteId" TEXT,

    CONSTRAINT "Correos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefonos" (
    "id" SERIAL NOT NULL,
    "telefono" TEXT NOT NULL,
    "clienteId" TEXT,

    CONSTRAINT "Telefonos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correos" ADD CONSTRAINT "Correos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefonos" ADD CONSTRAINT "Telefonos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
