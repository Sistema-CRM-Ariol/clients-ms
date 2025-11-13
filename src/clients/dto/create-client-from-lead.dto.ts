import { Prisma } from "@prisma/client";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";


export class CreateClientFromLeadDto implements Prisma.ClientsCreateInput {
    @IsString()
    name: string;

    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    companyName?: string | null;

    @IsOptional()
    @IsString()
    position?: string | null;

    @IsString()
    city: string;

    @IsString()
    @IsOptional()
    address: string | null;

    @IsOptional()
    @IsString()
    razonSocial?: string | null;

    @IsOptional()
    @IsString()
    nit?: string | null;

    @IsEmail()
    email1: string;

    @IsOptional()
    @IsEmail()
    email2?: string | null;

    @IsString()
    phone1: string;

    @IsOptional()
    @IsString()
    phone2?: string | null;

    @IsOptional()
    @IsString()
    notes?: string; 
    
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}

