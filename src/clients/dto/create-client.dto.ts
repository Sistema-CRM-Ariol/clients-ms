import { Prisma } from '@prisma/client';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto implements Prisma.ClientsCreateInput{
    @IsString({ message: "El nombre es requerido" })
    name: string;

    @IsString({ message: "El apellido es requerido" })
    lastname: string;
    
    @IsOptional()
    @IsString()
    companyName?: string | null;

    @IsOptional()
    @IsString({ message: "Debe asignar un cargo" })
    position?: string;

    @IsString({ message: "Debe agregar una ciudad" })
    city: string;

    @IsString({ message: "Agregue la direccion" })
    address: string;

    @IsOptional()
    @IsString({ message: "Razón social invalida" })
    razonSocial?: string;

    @IsOptional()
    @IsString({ message: "NIT invalido" })
    nit?: string;

    @IsString({ message: "Debe asignar un telefono" })
    phone1: string;

    @IsOptional()
    @IsString({ message: "Debe asignar un telefono" })
    phone2?: string | null;

    @IsString({ message: "Debe asignar un correo" })
    @IsEmail({}, { message: "El correo no es valido" })
    email1: string;

    @IsOptional()
    @IsEmail({}, { message: "El correo no es valido" })
    email2?: string | null;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean | undefined;
}
