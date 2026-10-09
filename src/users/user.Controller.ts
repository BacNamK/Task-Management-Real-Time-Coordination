import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.Service.js';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get() {
    return 'Users';
  }
}
