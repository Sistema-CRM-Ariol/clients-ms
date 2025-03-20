import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { clientsSeeder } from 'src/data/clients.seeder';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

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

      const client = await this.prisma.clients.create({
        data: {
          ...createClientDto,
        }
      })

      return {
        message: "Se creo el cliente exitosamente",
        client
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
          { invoice: { contains: search, mode: 'insensitive' } },
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
          address: true,
          emails: true,
          phones: true,
          position: true,
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
      const client = await this.prisma.clients.update({
        where: {
          id: id
        },
        data: updateClientDto
      });

      return {
        client,
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

  async getMonthlyClientsStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Obtener usuarios registrados agrupados por fecha dentro del mes actual
    const users = await this.prisma.clients.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Transformar datos para obtener un arreglo de fechas y sus respectivos conteos
    const daysInMonth = endOfMonth.getDate();
    const dates: string[] = [];
    const numberOfClients: number[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), i).toISOString().split('T')[0];
      dates.push(date);

      const count =
        users.find((u) => new Date(u.createdAt).toISOString().split('T')[0] === date)?._count
          .createdAt || 0;

      numberOfClients.push(count);
    }

    return { dates, numberOfClients };
  }

}
