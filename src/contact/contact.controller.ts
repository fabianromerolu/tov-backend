import { Controller, Post, Body } from '@nestjs/common';
import { ContactService }            from './contact.service';
import { CreateContactDto }         from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  async create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }
}
