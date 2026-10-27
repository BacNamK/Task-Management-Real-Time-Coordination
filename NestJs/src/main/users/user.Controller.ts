import { Controller, Get, Query } from '@nestjs/common';
import { serializeBigInt } from '../../common/utils/bigint.util.js';
import { UsersService } from './users.Service.js';

@Controller('/users')
export class UsersController {
  constructor(private readonly Service: UsersService) {}

  @Get('/field')
  async get(@Query('value') value: string) {
    const user = await this.Service.getByField(value);
    return serializeBigInt(user);
  }
}
