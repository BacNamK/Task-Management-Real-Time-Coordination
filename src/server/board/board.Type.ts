export interface Board {
    id: number;
    name: string;
    workspaceUuid: string;
}

export interface BoardService  {
    name: string;
    columnsJson: object[];
}
