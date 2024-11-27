import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { clientsSeeder } from 'src/data/clients.seeder';

@Injectable()
export class ClientsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ClientsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Clients Database connected');
  }

  async create(createClientDto: CreateClientDto) {
    const client = await this.clientes.create({
      data: {
        ...createClientDto,
      },
      include: {
        empresa: true,
      }
    })

    return {
      message: "Se creo el cliente exitosamente",
      client
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit, search } = paginationDto;
    const totalClients = await this.clientes.count();



    if (!search) {
      const lastPage = Math.ceil(totalClients / limit);

      return {
        clientes: await this.clientes.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            empresa: true,
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

    const totalPages = await this.clientes.count({
      where: {
        OR: [
          {
            nombre: {
              contains: search
            },
          },
          {
            nit: { contains: search }
          },
          { correos: { hasSome: [search] } }

        ]

      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      clientes: await this.clientes.findMany({
        where: {
          OR: [
            {
              nombre: {
                contains: search
              },
            },
            {
              nit: { contains: search }
            },
            { correos: { hasSome: [search] } }

          ]

        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          empresa: true,
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
    try {

      const client = await this.clientes.findFirstOrThrow({
        where: { id: id },
        include: {
          empresa: true
        }
      })

      return { client };

    } catch (error) {
    
      throw new NotFoundException("No se encontro el cliente");
    }

  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {

      const client = await this.clientes.findFirstOrThrow({
        where: { id: id },
      })

      await this.clientes.update({
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
    const cliente = await this.clientes.delete({
      where: { id }
    });
    return {
      message: `Se elimino el cliente: ${cliente.nombre}`,
    };
  }

  async seed() {
    await this.clientes.deleteMany();

    await this.clientes.createMany({
      data: clientsSeeder
    })

    return {
      message: "Se insertaron los 50 usuarios de prueba"
    }
  }
}
