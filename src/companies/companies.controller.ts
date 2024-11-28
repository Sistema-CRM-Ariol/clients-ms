import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @MessagePattern('createCompany')
  create(@Payload() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @MessagePattern('findAllCompanies')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }

  @MessagePattern('updateCompany')
  update(@Payload() { id, updateCompanyDto }: { id: string, updateCompanyDto: UpdateCompanyDto }) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @MessagePattern('removeCompany')
  remove(@Payload() id: string) {
    return this.companiesService.remove(id);
  }

  @MessagePattern('seedCompany')
  seed() {
    return this.companiesService.seed();
  }
}
