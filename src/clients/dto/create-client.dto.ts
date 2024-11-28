import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
    @IsString({ message: "El nombre es requerido" })
    name:        string;

    @IsString({ message: "Debe asignar un cargo" })
    position:    string;
    
    @IsString({ message: "Debe agregar un departamento" })
    departament: string;

    @IsString({ message: "Agregue la provincia" })
    province:    string;

    @IsString({ message: "Agregue la direccion" })
    address:     string;

    @IsString({ message: "Debe asignar un nombre para la factura" })
    invoice:     string;

    @IsString({ message: "Debe agregar un NIT" })
    nit:         string;

    @IsString({ each: true })
    @IsOptional()
    emails?:      string[];

    @IsString({ each: true })
    @IsOptional()
    phones?:      string[];

    @IsString({ message: "Debe asigar una empresa" })
    @IsOptional()
    companyId?: string | never;

}
