import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { UsersRepository } from '../../main/users/users.Repository.js';
import { EnsureUserDto } from './ensure-user.dto.js';

@Controller('auth/users')
export class UsersAuthController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  async get(@Query('email') email: string) {
    const serializedUser = await this.usersRepository.findUserByEmail(email);
    const user = JSON.parse(serializedUser) as {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      roleUsers: { role: { roleName: string } }[];
    } | null;

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatar,
      role: user.roleUsers[0]?.role.roleName,
    };
  }

  @Post('/ensure')
  async ensure(@Body() body: EnsureUserDto) {
    const serializedUser = await this.usersRepository.ensureUser(
      body.name,
      body.email,
      body.picture ?? null,
    );
    const user = JSON.parse(serializedUser) as {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      roleUsers: { role: { roleName: string } }[];
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatar,
      role: user.roleUsers[0]?.role.roleName,
    };
  }
}
