export const Model = ({ board }: any) => {
    const countColumns = board.columnsConfig.map((item: ColumnConfig) => item.item.length);
    const col = Number(countColumns[0]);
    return (
        <div className="w-full h-auto bg-white p-4 rounded-md shadow-md">
            <header className="flex gap-5 items-center">
                <h3 className="text-xl font-bold">{board.name}</h3>
                <p className="text-sm text-gray-500">
                    Created on {board.createdAt.toLocaleDateString()}
                </p>
            </header>
            <div className="w-full gap-2">
                {board.columnsConfig.map((column: ColumnConfig, index: number) => (
                    <div key={column.id}>
                        <h4 className="text-lg ">Tiến Trình {index + 1}</h4>
                        <div
                            className="w-full grid  border"
                            style={{
                                gridTemplateColumns: `repeat(${col}, minmax(0, 1fr))`,
                            }}
                        >
                            {column.item.map((item: ColumnItem) => (
                                <div key={item.id} className="border-l">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
