import prisma from '@/src/lib/prisma';

export const findUserByName = async (name: string) => {
    return await prisma.user.findUnique({
        where: { name },
        select: { name: true },
    });
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
};

export const createUser = async (
    name: string,
    email: string,
    image: string,
    password_hash: string
) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
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
};
