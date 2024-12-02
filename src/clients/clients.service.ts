import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { clientsSeeder } from 'src/data/clients.seeder';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) { }


  async create(createClientDto: CreateClientDto) {

    const client = await this.prisma.clients.create({
      data: {
        ...createClientDto,
      }
    })

    return {
      message: "Se creo el cliente exitosamente",
      client
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit, search } = paginationDto;
    const totalClients = await this.prisma.clients.count();



    if (!search) {
      const lastPage = Math.ceil(totalClients / limit);

      const clients = await this.prisma.clients.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          companyId: false,
          name: true, address: true, emails: true, phones: true, nit: true, createdAt: true, id: true, position: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      })


      return {
        clients,
        meta: {
          total: totalClients,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalPages = await this.prisma.clients.count({
      where: {
        OR: [
          {
            name: {
              contains: search
            },
          },
          {
            nit: { contains: search }
          },
          { emails: { hasSome: [search] } }

        ]

      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      clients: await this.prisma.clients.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search
              },
            },
            {
              nit: { contains: search }
            },
            { emails: { hasSome: [search] } }

          ]

        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          companyId: false,
          name: true, address: true, emails: true, phones: true, nit: true, createdAt: true, id: true, position: true,
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      meta: {
        total: totalClients,
        page: page,
        lastPage: lastPage,
      }
    }

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

      const client = await this.prisma.clients.findFirstOrThrow({
        where: { id: id },
      })

      await this.prisma.clients.update({
        where: {
          id: id,
        },
        data: updateClientDto
      })

      return {
        message: "Se actualizo la informacion del cliente",
        client,
      };
    } catch (error) {
      throw new NotFoundException("No se encontro el cliente");
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

  async getClientsStats(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const now = new Date();

    let startDate: Date;
    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const firstDayOfWeek = now.getDate() - now.getDay(); // Asume domingo como primer día
        startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        throw new Error('Invalid period');
    }

    // Obtener usuarios registrados agrupados por fecha
    const users = await this.prisma.clients.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
    });

    // Transformar datos
    const dates: string[] = [];
    const numberOfClients: number[] = [];

    for (let i = new Date(startDate); i <= now; i.setDate(i.getDate() + 1)) {
      const date = i.toISOString().split('T')[0];
      dates.push(date);

      const count =
        users.find((u) => new Date(u.createdAt).toISOString().split('T')[0] === date)?._count
          .createdAt || 0;

      numberOfClients.push(count);
    }

    return { dates, numberOfClients };
  }
}
