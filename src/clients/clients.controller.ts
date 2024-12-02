import { Controller, ParseEnumPipe, Query } from '@nestjs/common';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @MessagePattern('seedClient')
  seed() {
    return this.clientsService.seed();
  }

  @MessagePattern('createClient')
  create(@Payload() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @MessagePattern('findAllClients')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @MessagePattern('findOneClient')
  findOne(@Payload() id: string) {
    return this.clientsService.findOne(id);
  }

  @MessagePattern('updateClient')
  update(@Payload() { id, updateClientDto }: { id: string, updateClientDto: UpdateClientDto }) {
    return this.clientsService.update(id, updateClientDto);
  }

  @MessagePattern('removeClient')
  remove(@Payload() id: string) {
    return this.clientsService.remove(id);
  }

  @MessagePattern('clientsStadistics')
  getClientsStats() {
    return this.clientsService.getMonthlyClientsStats();
  }
}
