import prisma from '@/src/lib/prisma';

export const createCycleRp = (boardId: number) => {
    return prisma.cycle.create({
        data: {
            title: 'Default',
            position: 0,
            boardId: boardId,
            columns: [
                { position: 0, name: 'To Do' },
                { position: 1, name: 'In Progress' },
                { position: 2, name: 'Done' },
            ],
        },
    });
};

export const updateCycleColumnsRp = (id: any, rawdData: any) => {
    return prisma.cycle.update({
        where: { id: id },
        data: {
            columns: rawdData,
        },
    });
};
