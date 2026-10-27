export interface Board {
  id: number;
  name: string;
  projectUuid: string;
}

export interface BoardDto {
  name: string;
  columnsJson: object[];
}
