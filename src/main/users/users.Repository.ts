import { prisma } from '../../lib/prisma.Client.js';

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
  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }
  async createUser(name: string, email: string, image: string) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: '',
        image,
      },
    });

    await prisma.roleUser.create({
      data: {
        userId: user.id,
        // Vai trò member id : 1
        roleId: 1,
      },
    });
  }
}
