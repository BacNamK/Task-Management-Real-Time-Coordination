import prisma from '@/src/lib/prisma';
import { onwType } from '@/src/types/listWorkspace.Type';

export const createWorkspaceRepository = async (
    workspaceName: string,
    userId: bigint,
    slug: string
) => {
    const workspace = await prisma.workspace.create({
        data: {
            name: workspaceName.trim(),
            slug: slug,
        },
    });

    await prisma.workspaceMember.create({
        data: {
            workspaceId: workspace.id,
            userId: BigInt(userId),
            role: 'ADMIN',
        },
    });
    return workspace;
};

export const getWorkspaceRepository = async (userId: bigint) => {
    const memberships = await prisma.workspaceMember.findMany({
        where: {
            userId: BigInt(userId),
        },
        select: {
            role: true,
            workspace: {
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    slug: true,
                    createdAt: true,
                    members: {
                        select: {
                            role: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return memberships.reduce(
        (result, membership) => {
            const workspace = {
                workspace: {
                    id: membership.workspace.id.toString(),
                    uuid: membership.workspace.uuid,
                    name: membership.workspace.name,
                    slug: membership.workspace.slug,
                    createdAt: membership.workspace.createdAt,
                },
                user: membership.workspace.members.map(({ user, role }) => ({
                    id: user.id.toString(),
                    name: user.name,
                    image: user.image,
                    role,
                })),
            };

            if (membership.role === 'ADMIN') {
                result.yourOwn.push(workspace);
            } else {
                result.yourMem.push(workspace);
            }

            return result;
        },
        {
            yourOwn: [] as onwType[],
            yourMem: [] as onwType[],
        }
    );
};
