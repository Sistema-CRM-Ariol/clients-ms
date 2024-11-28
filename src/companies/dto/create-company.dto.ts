import { IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    
    @IsString({ message: "Debe agregar un nombre" })
    name:string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    direction: string;
}