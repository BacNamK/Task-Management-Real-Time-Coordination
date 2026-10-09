import { prisma } from '../lib/prisma.Client.js';

export class RoleUserRp {
  constructor() {}
  async findRoleUser(userId: number) {
    return await prisma.roleUser.findUnique({
      where: { userId },
      select: { roleId: true },
    });
  }
}
