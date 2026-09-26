import { useItemsStore } from '@/src/hooks/workspaceHook';
import { updateBoard } from '@/src/server/actions/board.action';
import { useEffect, useState } from 'react';

type prop = {
    columns: ColumnConfig[];
    setIsEditColumnsOpen: (value: boolean) => void;
    boardId: string;
};

const EditColumnsBoard = ({ columns, setIsEditColumnsOpen, boardId }: prop) => {
    const [columnsItems, setColumnsItems] = useState<any>();

    const setValue = (e: any) => {
        setColumnsItems(columns.map((column) => column.item));
    };

    useEffect(() => {
        setValue(columns);
    }, [columns]);

    const addNewColumns = (e: any) => {
        e.preventDefault();
        const newColumnsName = e.target.newColumnsName.value;
        const id = String(columnsItems[0].length + 1);
        columnsItems[0].push({
            id,
            name: newColumnsName,
        });
        setValue(columns);
        e.target.reset();
    };

    const workspaceUuid = useItemsStore((state) => state.selectedItem?.workspace.uuid);

    const updateColumns = async (e: any) => {
        e.preventDefault();
        const parseColumns = columnsItems.flat();
        const data = [{ id: columns[0].id, item: parseColumns, name: columns[0].name }];
        await updateBoard(BigInt(boardId), workspaceUuid, data);
        setIsEditColumnsOpen(false);
    };

    return (
        <div className="absolute z-20 top-0 left-0 w-full h-full bg-black/20 shadow backdrop-blur-md flex items-center justify-center">
            <main className="relative w-1/2 h-1/2 bg-white rounded-md">
                <form className="p-8">
                    <div className="flex items-center gap-5">
                        <div className="w-full flex items-center justify-center gap-2 border-b border-gray-300 ">
                            <label className="w-1/6 text-center ">Name Cycle</label>
                            <input
                                type="text"
                                className="w-5/6 p-2"
                                placeholder={`${columns[0].name}`}
                            />
                        </div>
                        <button
                            onClick={() => setIsEditColumnsOpen(false)}
                            className="block h-full p-2 border-2 rounded-md border-red-500 text-red-500 text-sm"
                        >
                            Close
                        </button>
                    </div>
                    <div className="mt-4">
                        {columns.map((column) => (
                            <div
                                key={column.id}
                                className="grid grid-cols-4 gap-2 row-auto items-center justify-center"
                            >
                                {column.item.map((item) => (
                                    <div
                                        key={item.id}
                                        className="w-full h-12 border border-gray-300 flex items-center justify-center"
                                    >
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => {
                                                setValue(e.target.value);
                                            }}
                                            className="w-full h-full text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </form>
                <div className="absolute bottom-0 w-full justify-between flex p-8">
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
                    <div className="w-1/2 flex justify-end">
                        <button
                            onClick={updateColumns}
                            className="block pl-2 pr-2 border-2 rounded-md border-green-500 text-green-500"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditColumnsBoard;
