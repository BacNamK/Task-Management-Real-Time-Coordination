'use client';

import Link from 'next/link';
import { FormCreateBoard } from '../../forms/CreateBoard';

type BoardListData = {
    uuid: string;
    boards: any;
    slug: string;
    name: string;
    createdAt: Date;
};

const PageClient = ({ data }: { data: BoardListData }) => {
    console.log(data);
    return (
        <div className="h-full w-full">
            <FormCreateBoard workspaceUuid={data.uuid} />
            <div className="w-full grid gap-y-4 h-auto bg-white">
                {data.boards.map((board: any) => (
                    <Link
                        href={`/workspaces/${data.uuid}/${board.id}`}
                        key={board.id}
                        className="w-full text-center p-2 rounded-md bg-green-300 text-black/70 text-sm font-medium"
                    >
                        {board.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PageClient;
