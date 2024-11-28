import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { companiesSeeder } from 'src/data/companies.seeder';
import { PaginationDto } from 'src/common';

@Injectable()
export class CompaniesService {

  constructor(private prisma: PrismaService) { }

  async create(createCompanyDto: CreateCompanyDto) {

    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
      }
    })

    return {
      message: "Se registro la empresa con exito",
      company
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit, search } = paginationDto;

    const totalBrands = await this.prisma.company.count();

    if (!search) {
      const lastPage = Math.ceil(totalBrands / limit);

      return {
        companies: await this.prisma.company.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),
        meta: {
          total: totalBrands,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalPages = await this.prisma.company.count({
      where: {
        OR: [
          {
            name: {
              contains: search
            },
          }
        ]

      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      companies: await this.prisma.company.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search
              },
            }
          ]

        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      meta: {
        total: totalBrands,
        page: page,
        lastPage: lastPage,
      }
    }

  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async remove(id: string) {
    console.log({id})
    const company = await this.prisma.company.delete({
      where: { id }
    });
    return {
      message: `Se elimino el empresa: ${company.name}`,
    };
  }

  async seed() {
    await this.prisma.company.deleteMany();

    await this.prisma.company.createMany({
      data: companiesSeeder
    })

    return {
      message: "Se insertaron los 10 empresas de prueba"
    }
  }
}
