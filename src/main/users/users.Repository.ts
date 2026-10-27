import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class UsersRepository {
  constructor() {}

  async returnId(userUuid: string) {
    return await prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });
  }

  async findUserByName(name: string) {
    return await prisma.user.findUnique({
      where: { name },
      select: { name: true, image: true, uuid: true, id: true },
    });
  }
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        roleUsers: {
          select: {
            role: {
              select: { roleName: true },
            },
          },
        },
      },
    });
    return serializeBigInt(user);
  }

  async ensureUser(name: string, email: string, avatar: string | null) {
    const user = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: { name, email, avatar },
      });

      return tx.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          roleUsers: { select: { role: { select: { roleName: true } } } },
        },
      });
    });
    return serializeBigInt(user);
  }
  async createUser(name: string, email: string, image: string) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatar: image,
      },
    });

    await prisma.roleUserSys.create({
      data: {
        userId: user.id,
        // Vai trò member id : 1
        roleId: 1,
      },
    });
  }
}
