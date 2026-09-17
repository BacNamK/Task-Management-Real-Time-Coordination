import prisma from '@/src/lib/prisma';

export const findRoleUser = async (userId: number) => {
    return await prisma.roleUser.findUnique({
        where: { userId },
        select: { roleId: true },
    });
};
