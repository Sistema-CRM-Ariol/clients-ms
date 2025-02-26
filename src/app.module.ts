import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ClientsModule, CompaniesModule, PrismaModule],

})
export class AppModule {}
