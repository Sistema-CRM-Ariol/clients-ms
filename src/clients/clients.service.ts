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

      console.log({ error })

      throw new RpcException(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit, search } = paginationDto;
    const totalClients = await this.prisma.clients.count();

    if (!search) {
      const lastPage = Math.ceil(totalClients / limit);

      const clients = await this.prisma.clients.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
        select: {
          companyId: false,
          name: true, address: true, emails: true, phones: true, nit: true, createdAt: true, id: true, position: true,
        },
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
          { name: { contains: search } },
          { nit: { contains: search } },
          { emails: { hasSome: [search] } }
        ]
      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      clients: await this.prisma.clients.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { nit: { contains: search } },
            { emails: { hasSome: [search] } }
          ]
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
        select: {
          companyId: false,
          name: true, address: true, emails: true, phones: true, nit: true, createdAt: true, id: true, position: true,
        },
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
