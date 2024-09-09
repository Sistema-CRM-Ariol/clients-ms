import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  departamento?: string;
  
  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  factura?: string;
  
  @IsOptional()
  @IsString()
  nit?: string

  @IsOptional()
  @IsString()
  nombre?: string
  
  @IsOptional()
  @IsString()
  provincia?: string
  
  @IsOptional()
  @IsArray({})
  correos?: string[];

  @IsOptional()
  empresaId?: never;

  @IsOptional()
  telefonos?: string[];

  id?: string;

}
