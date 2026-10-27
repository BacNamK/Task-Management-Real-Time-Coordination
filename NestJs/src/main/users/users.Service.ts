import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.Repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly Repository: UsersRepository) {}

  async getByField(value: string) {
    if (value.includes('@')) {
      return await this.Repository.findUserByEmail(value);
    }
    return await this.Repository.findUserByName(value);
  }
}
