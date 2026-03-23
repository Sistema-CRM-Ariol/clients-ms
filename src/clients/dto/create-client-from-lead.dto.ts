import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

// {
//     id: '96a28822-7b06-4913-a4e1-06464c8117fd',
//     name: 'Maria',
//     lastname: 'Garcia 002',
//     company: 'Empresa 002',
//     position: 'Directora de Compras',
//     city: 'Cochabamba',
//     address: 'Calle Heroinas 567, Oficina 2',
//     razonSocial: 'RS-002',
//     nit: '1070000001',
//     email1: 'maria.garcia002@logistica.com',
//     email2: 'maria002@mail.com',
//     phone1: '+59171000001',
//     phone2: '+59161000001',
//     source: 'WEB',
//     status: 'NEW',
//     priority: 'MEDIUM',
//     description: 'Lead generado para pruebas (002) en Cochabamba.',
//     notes: 'Seguimiento automatico del lead 002.',
//     assignedToId: null,
//     clientId: null,
//     isActive: true,
//     createdAt: 2025-12-03T05:48:18.305Z,
//     updatedAt: 2026-03-23T15:40:36.376Z
//   }
export class CreateClientFromLeadDto {
	@IsString({ message: "El nombre es requerido" })
	name: string;

	@IsString({ message: "El apellido es requerido" })
	lastname: string;

	@IsOptional()
	@IsString({ message: "La empresa debe ser un texto" })
	company?: string | null;

	@IsOptional()
	@IsString({ message: "El cargo debe ser un texto" })
	position?: string | null;

	@IsString({ message: "Debe agregar una ciudad" })
	city: string;

	@IsOptional()
	@IsString({ message: "La direccion debe ser un texto" })
	address?: string | null;

	@IsOptional()
	@IsString({ message: "Razon social invalida" })
	razonSocial?: string | null;

	@IsOptional()
	@IsString({ message: "NIT invalido" })
	nit?: string | null;

	@IsEmail({}, { message: "El correo principal no es valido" })
	email1: string;

	@IsOptional()
	@IsEmail({}, { message: "El correo secundario no es valido" })
	email2?: string | null;

	@IsString({ message: "Debe asignar un telefono principal" })
	phone1: string;

	@IsOptional()
	@IsString({ message: "El telefono secundario debe ser un texto" })
	phone2?: string | null;

	@IsOptional()
	@IsBoolean({ message: "El estado activo debe ser verdadero o falso" })
	isActive?: boolean;
}

