import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
    
    @IsString()
    cargo: string;

    @IsString()
    departamento: string;
    
    @IsString()
    direccion: string;

    @IsString()
    factura: string;
    
    @IsString()
    nit: string

    @IsString()
    nombre: string
    
    @IsString()
    provincia: string
    
    @IsOptional()
    @IsArray({})
    correos?: string[];

    @IsOptional()
    companyId?: string;

    @IsOptional()
    telefonos?: string[];

}
