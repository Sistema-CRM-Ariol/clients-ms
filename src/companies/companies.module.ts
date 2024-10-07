import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CompaniesController],
  imports: [PrismaModule],
  providers: [CompaniesService],
})
export class CompaniesModule {}
