export interface Board {
  id: number;
  name: string;
  workspaceUuid: string;
}

export interface BoardDto {
  name: string;
  columnsJson: object[];
}
