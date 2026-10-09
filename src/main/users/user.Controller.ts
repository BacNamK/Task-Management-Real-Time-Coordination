import { Controller, Get, Query } from '@nestjs/common';
import { UsersRepository } from './users.Repository.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  async get(@Query('name') name: string) {
    const user = await this.usersRepository.findUserByName(name);
    return serializeBigInt(user);
  }
}
