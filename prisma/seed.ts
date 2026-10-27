// prisma/seed.ts
import { prisma } from '../src/lib/prisma.Client.js';

async function main() {
  console.log('Đang khởi tạo dữ liệu mẫu...');

  const permissions = [
    { name: 'RESTRICTED', description: 'Quyền hạn chế' },
    { name: 'READ', description: 'Quyền chỉ đọc' },
    { name: 'EDIT', description: 'Quyền chỉnh sửa' },
    { name: 'FULL_ACCESS', description: 'Toàn quyền' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }

  const roles = [
    { roleName: 'ADMIN' as const, description: 'Quản trị viên' },
    { roleName: 'MODER' as const, description: 'Điều hành viên' },
    { roleName: 'USER' as const, description: 'Người dùng' },
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { roleName: role.roleName },
    });

    if (existingRole) {
      await prisma.role.update({
        where: { id: existingRole.id },
        data: { description: role.description },
      });
    } else {
      await prisma.role.create({ data: role });
    }
  }

  console.log('Quyền mẫu đã được tạo:', permissions.map(({ name }) => name));
  console.log('Vai trò mẫu đã được tạo:', roles.map(({ roleName }) => roleName));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
