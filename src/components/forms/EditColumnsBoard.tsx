import { useItemsStore } from '@/src/hooks/workspaceHook';
import { updateBoard } from '@/src/server/actions/board.action';
import { useEffect, useState } from 'react';

type prop = {
    columns: ColumnConfig[];
    setIsEditColumnsOpen: (value: boolean) => void;
    boardId: string;
    columnId: number;
    setDataColumn: () => void;
};

const EditColumnsBoard = ({ columns, setIsEditColumnsOpen, boardId, columnId }: prop) => {
    const [column, setColumn] = useState<any[]>([]);

    const setValue = (columnId: number, name: string) => {
        setColumn((prev) =>
            prev.map((column, index) => {
                if (index !== columnId) return column;

                const newItems = [
                    ...column.item,
                    {
                        id: '',
                        name,
                    },
                ].map((item, index) => ({
                    ...item,
                    id: String(index),
                }));

                return {
                    ...column,
                    item: newItems,
                };
            })
        );
    };

    useEffect(() => {
        const newColumn = columns.map((column) => ({
            ...column,
            item: [...column.item],
        }));

        setColumn(newColumn);
    }, [columns]);

    const addNewColumns = (e: any) => {
        e.preventDefault();

        const newColumnsName = e.target.newColumnsName.value;

        setValue(columnId, newColumnsName);

        e.target.reset();
    };

    const workspaceUuid = useItemsStore((state) => state.selectedItem?.workspace.uuid);

    const updateColumns = async (e: any) => {
        e.preventDefault();
        const parseColumns = column.flat();
        await updateBoard(BigInt(boardId), workspaceUuid, parseColumns);
        setIsEditColumnsOpen(false);
    };

    const clearColumn = (columnId: number) => {
        console.log(column[columnId]);

        setColumn((prev: any[]) => prev.filter((_, index) => index !== columnId));
    };

    return (
        <div className="absolute z-20 top-0 left-0 w-full h-full bg-black/20 shadow backdrop-blur-md flex items-center justify-center">
            <main className="relative w-2/3 h-2/3 bg-white rounded-md">
                <form className="p-8">
                    <div className="flex items-center gap-5">
                        <div className="w-full flex items-center justify-center gap-2 border-b border-gray-300 ">
                            <label className="w-1/6 text-center ">Cycle</label>
                            <input
                                type="text"
                                name="cycleName"
                                className="w-5/6 p-2"
                                placeholder={`${columns?.[columnId]?.name}`}
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2 row-auto items-center justify-center">
                        {column?.[columnId]?.item?.map((column: ColumnConfig) => (
                            <div
                                key={column.id}
                                className="w-full h-12 border border-gray-300 flex items-center justify-center"
                            >
                                {column.name}
                            </div>
                        ))}
                    </div>
                </form>
                <div className="w-full flex pl-8 items-center justify-center">
                    <button
                        onClick={() => clearColumn(columnId)}
                        className="border-b-2 p-2 border-red-400 text-red-400"
                    >
                        Clear all columns
                    </button>
                </div>
                <p className="text-center pl-8 pr-8 pt-4 text-sm tracking-wider text-gray-400">
                    Column names and the order of columns cannot be changed, new ones must be
                    created instead. There is a limit of 10 columns.
                </p>
                <div className="absolute bottom-0 w-full justify-between flex pl-8 pr-8 pb-8">
                    <form
                        onSubmit={addNewColumns}
                        className="w-1/2 flex gap-2 items-center justify-center border-b-2 border-gray-300"
                    >
                        <input
                            type="text"
                            name="newColumnsName"
                            id=""
                            placeholder="New Columns"
                            className="p-2 outline-none"
                        />
                        <button type="submit" className="block p-1">
                            Add
                        </button>
                    </form>
                    <div className="w-1/2 flex justify-end gap-15">
                        <button
                            onClick={updateColumns}
                            className="block pl-2 pr-2 border-b-2 border-orange-400 text-orange-400"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setIsEditColumnsOpen(false)}
                            className="block h-full p-2 border-b-2 border-green-500 text-green-500 "
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditColumnsBoard;
