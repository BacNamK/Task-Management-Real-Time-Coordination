type ColumnItem = {
    id: string;
    name: string;
};

type ColumnConfig = {
    id: string;
    name: string;
    item: ColumnItem[];
};
type Board = {
    id: bigint;
    name: string | null;
    workspaceId: bigint;
    columnsConfig: ColumnConfig[];
    createdAt: Date;
};
