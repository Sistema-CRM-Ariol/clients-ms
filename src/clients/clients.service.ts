import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { clientsSeeder } from 'src/data/clients.seeder';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';
import { CreateClientFromLeadDto } from './dto/create-client-from-lead.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async create(createClientDto: CreateClientDto) {
        const clientExists = await this.prisma.clients.findFirst({
            where: {
                OR: [
                    { nit: createClientDto.nit },
                ]
            },
        })

        if (clientExists) {
            throw new RpcException({
                message: "Ya registro un cliente con este NIT",
                status: HttpStatus.BAD_REQUEST
            });
        }


        try {
            await this.prisma.clients.create({
                data: {
                    ...createClientDto,
                }
            })

            return {
                message: "Se creo el cliente exitosamente",
            }
        } catch (error) {
            throw new RpcException(error);
        }

    }

    async findAll(filterPaginationDto: FilterPaginationDto) {
        const { page, limit, search, isActive } = filterPaginationDto;

        const filters: any[] = [];

        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { nit: { contains: search, mode: 'insensitive' } },
                    { razonSocial: { contains: search, mode: 'insensitive' } },
                ],
            });
        }

        // Si status viene definido, lo agregamos
        if (isActive !== undefined) {
            filters.push({ isActive });
        }

        // Si existen filtros, los combinamos en un AND; de lo contrario, la consulta no tiene filtro
        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Ejecutamos la consulta de conteo y búsqueda con el mismo whereClause
        const [totalClients, clients] = await Promise.all([
            this.prisma.clients.count({
                where: whereClause,
            }),
            this.prisma.clients.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: { updatedAt: 'desc' },
                where: { ...whereClause, },
                select: {
                    id: true,
                    nit: true,
                    name: true,
                    lastname: true,
                    email1: true,
                    phone1: true,
                    razonSocial: true,
                    isActive: true,
                    createdAt: true,
                },

            }),
        ]);

        const lastPage = Math.ceil(totalClients / limit!);

        return {
            clients,
            meta: {
                page,
                lastPage,
                total: totalClients,
            },
        };
    }

    async findOne(id: string) {

        const client = await this.prisma.clients.findFirst({
            where: { id: id },
            include: {
                company: true,
            }
        });

        if (!client) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: "No se encontro el usuario"
            })
        }

        return { client };
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        try {
            await this.prisma.clients.update({
                where: {
                    id: id
                },
                data: updateClientDto
            });

            return {
                message: 'Cliente actualizado'
            };

        } catch (error) {

            if (error.code === 'P2002' && error.meta?.target?.includes('nit')) {
                throw new RpcException({
                    statusCode: 400,
                    message: 'El numero de documento esta siendo utilizado'
                })
            }

            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: 'Persona no encontrada'
                })
            }

            throw new RpcException({
                statusCode: 500,
                message: 'Error al actualizar la persona'
            })
        }
    }

    async remove(id: string) {
        const client = await this.prisma.clients.delete({
            where: { id }
        });
        return {
            message: `Se elimino el cliente: ${client.name}`,
        };
    }

    async seed() {
        await this.prisma.clients.deleteMany();

        await this.prisma.clients.createMany({
            data: clientsSeeder
        })

        return {
            message: "Se insertaron los 50 usuarios de prueba"
        }
    }


    async stats() {
        /**
         * Retorna estadísticas básicas de clientes:
         * - total: conteo total de clientes
         * - newClients: { current, previous, delta, percent }
         *   donde `current` son clientes creados desde el inicio del mes actual,
         *   `previous` los creados en el mes anterior.
         * - inactiveClients: estadísticas de clientes desactivados durante el mes
         *   (deactivatedThisMonth vs deactivatedLastMonth).
         *
         * NOTA/ASUNCIÓN: No existe historial de cambios de `isActive` en la tabla,
         * por lo que para la comparación de "clientes inactivos" calculamos
         * cuántos clientes fueron marcados como inactivos (updatedAt) dentro
         * del mes actual y del mes anterior. Si se requiere un histórico exacto
         * por snapshot, sería necesario almacenar un log/audit de cambios.
         */

        try {
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            // Total clientes
            const totalClients = await this.prisma.clients.count();

            // Nuevos clientes: creados desde inicio del mes actual
            const newClientsCurrent = await this.prisma.clients.count({
                where: {
                    createdAt: { gte: startOfCurrentMonth },
                },
            });

            // Nuevos clientes: mes anterior (desde inicio del mes anterior hasta antes del mes actual)
            const newClientsPrevious = await this.prisma.clients.count({
                where: {
                    createdAt: { gte: startOfPreviousMonth, lt: startOfCurrentMonth },
                },
            });

            // Clientes desactivados: contamos los que tienen isActive = false y fueron actualizados
            // dentro de los rangos de mes actual y mes anterior (estimación de "desactivaciones").
            const deactivatedThisMonth = await this.prisma.clients.count({
                where: {
                    isActive: false,
                    updatedAt: { gte: startOfCurrentMonth },
                },
            });

            const deactivatedLastMonth = await this.prisma.clients.count({
                where: {
                    isActive: false,
                    updatedAt: { gte: startOfPreviousMonth, lt: startOfCurrentMonth },
                },
            });

            const computeDelta = (prev: number, curr: number) => {
                const delta = curr - prev;
                let percent: number | null = null;
                if (prev === 0) {
                    percent = curr === 0 ? 0 : 100;
                } else {
                    percent = (delta / prev) * 100;
                }
                return { delta, percent };
            };

            const newClientsDelta = computeDelta(newClientsPrevious, newClientsCurrent);
            const deactivatedDelta = computeDelta(deactivatedLastMonth, deactivatedThisMonth);

            return {
                total: totalClients,
                newClients: {
                    current: newClientsCurrent,
                    previous: newClientsPrevious,
                    delta: newClientsDelta.delta,
                    percentChange: Number(newClientsDelta.percent.toFixed(2)),
                },
                inactiveClients: {
                    totalInactiveNow: await this.prisma.clients.count({ where: { isActive: false } }),
                    deactivatedThisMonth,
                    deactivatedLastMonth,
                    delta: deactivatedDelta.delta,
                    percentChange: Number(deactivatedDelta.percent.toFixed(2)),
                },
            };

        } catch (error) {
            throw new RpcException(error);
        }

    }


    async getDashboardData() {
        try {
            const now = new Date();
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

            // Chart de nuevos clientes en los últimos 6 meses
            const recentClients = await this.prisma.clients.findMany({
                where: { createdAt: { gte: sixMonthsAgo } },
                select: { createdAt: true },
            });

            const monthlyMap: Record<string, number> = {};
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                monthlyMap[key] = 0;
            }
            for (const client of recentClients) {
                const key = `${client.createdAt.getFullYear()}-${String(client.createdAt.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyMap[key] !== undefined) monthlyMap[key]++;
            }
            const sixMonthChart = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

            // Top 5 clientes más recientes activos
            const topClients = await this.prisma.clients.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true, name: true, lastname: true,
                    companyName: true, city: true, email1: true,
                    phone1: true, createdAt: true,
                },
            });

            return { sixMonthChart, topClients };
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async createFromLead(createClientFromLeadDto: CreateClientFromLeadDto) {

        const clientExists = await this.prisma.clients.findFirst({
            where: {
                OR: [
                    { email1: createClientFromLeadDto.email1 },
                    { nit: createClientFromLeadDto.nit },
                    { razonSocial: createClientFromLeadDto.razonSocial },
                ]
            },
        })

        if (clientExists) {
            throw new RpcException({
                message: "Ya registro un cliente con este NIT, email o razon social",
                status: HttpStatus.BAD_REQUEST
            });
        }

        const client = await this.prisma.clients.create({
            data: {
                ...createClientFromLeadDto,
                isActive: true,
            }
        })

        return client;

    }
}
