import { IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    
    @IsString()
    name:string;

    @IsOptional()
    @IsString()
    description: string;

    
    @IsOptional()
    @IsString()
    direction: string;
}
