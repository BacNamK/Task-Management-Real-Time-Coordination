import { updateTaskAc } from '@/src/server/actions/task.action';
import { useEffect, useState } from 'react';

type prop = {
    cycle: any;
    boardId: string;
    setIsEditColumnsOpen: (value: boolean) => void;
};

const EditColumnsBoard = ({ cycle, setIsEditColumnsOpen }: prop) => {
    // Nhận prop từ chacha
    const [item, setItem] = useState<any>(cycle.columns);

    useEffect(() => {}, [cycle]); // Bắt buộc phải có [cycle] ở đây

    const addNewColumns = (e: any) => {
        e.preventDefault();

        const newColumnsName = e.target.newColumnsName.value;

        const position = item.length;

        setValue(position, newColumnsName);

        e.target.reset();
    };

    const setValue = (position: number, name: string) => {
        // prev là dữ liệu trước đó
        // thêm dữ liệu mới vào
        setItem((prev: any) => {
            return [
                ...prev,
                {
                    name,
                    position,
                },
            ];
        });
    };

    const updateColumns = async (e: any) => {
        e.preventDefault();
        await updateTaskAc(cycle.id, item);
        // đóng modelmodel
        setIsEditColumnsOpen(false);
    };

    const clearAllColumn = () => {
        setItem([]);
    };

    const clearolumn = (e: any, p: number) => {
        e.preventDefault();
        setItem((prev: any) => prev.filter((i: any) => i.position !== p));
    };

    console.log(item);

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
                                placeholder={`${cycle.title}`}
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2 row-auto items-center justify-center">
                        {item?.map((column: any, index: number) => (
                            <div
                                key={index}
                                className="relative group w-full h-12 border border-gray-300 flex items-center justify-center"
                            >
                                <p>{column.name}</p>
                                <button
                                    onClick={(e) => clearolumn(e, index)}
                                    className="absolute right-2 bg-red-400 text-white size-5 flex justify-center items-center rounded-full group-hover:visible invisible"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </form>
                <div className="w-full flex pl-8 items-center justify-center">
                    <button
                        onClick={clearAllColumn}
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
