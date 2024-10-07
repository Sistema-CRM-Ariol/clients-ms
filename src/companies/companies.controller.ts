import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @MessagePattern('createCompany')
  create(@Payload() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @MessagePattern('findAllCompanies')
  findAll() {
    return this.companiesService.findAll();
  }

  @MessagePattern('findOneCompany')
  findOne(@Payload() id: number) {
    return this.companiesService.findOne(id);
  }

  @MessagePattern('updateCompany')
  update(@Payload() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(updateCompanyDto.id, updateCompanyDto);
  }

  @MessagePattern('removeCompany')
  remove(@Payload() id: number) {
    return this.companiesService.remove(id);
  }
}
