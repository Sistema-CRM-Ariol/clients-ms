import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';
import { CreateClientFromLeadDto } from './dto/create-client-from-lead.dto';

@Controller()
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @MessagePattern('seedClient')
    seed() {
        return this.clientsService.seed();
    }

    @MessagePattern('createClient')
    create(@Payload() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @MessagePattern('findAllClients')
    findAll(@Payload() filterPaginationDto: FilterPaginationDto) {
        return this.clientsService.findAll(filterPaginationDto);
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

    @MessagePattern('clients.createFromLead')
    createFromLead(@Payload() createClientFromLead: CreateClientFromLeadDto) {
        return this.clientsService.createFromLead(createClientFromLead);
    }

    @MessagePattern('clients.stats')
    stats() {
        return this.clientsService.stats();
    }

}
