export interface ProjectType {
  id: bigint;
  uuid: string;
  name: string;
  description: string | null;
  createAt?: Date;
}
