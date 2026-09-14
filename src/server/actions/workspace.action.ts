'use server';

import { auth } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { geneSlug } from '../service/generSlug';
import { NextResponse } from 'next/server';
import { onwType } from '@/src/types/listWorkspace';

export const createWorkspace = async (formData: FormData) => {
    const session = await auth();
    const workspaceName = formData.get('workspaceName');

    if (typeof workspaceName !== 'string' || !workspaceName.trim()) {
        return;
    }

    if (!session?.user.id) {
        return;
    }

    const workspace = await prisma.workspace.create({
        data: {
            name: workspaceName.trim(),
            slug: geneSlug(workspaceName),
        },
    });

    await prisma.workspaceMember.create({
        data: {
            workspaceId: workspace.id,
            userId: BigInt(session?.user.id),
            role: 'ADMIN',
        },
    });

    return NextResponse.json({
        success: true,
        workspaceId: workspace.id.toString(),
        workspaceName: workspace.name,
    });
};

export const workspaceOwn = async () => {
    const session = await auth();

    if (!session?.user.id) {
        return {
            yourOwn: [],
            yourMem: [],
        };
    }

    const memberships = await prisma.workspaceMember.findMany({
        where: {
            userId: BigInt(session.user.id),
        },
        select: {
            role: true,
            workspace: {
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    slug: true,
                    members: {
                        select: {
                            role: true,
                            user: {
                                select: {
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
                },
                user: membership.workspace.members.map(({ user, role }) => ({
                    ...user,
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
