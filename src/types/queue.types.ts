export type ItemStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";

export interface QueueItem {
  id: string;
  name: string;
  status: ItemStatus;
  attempts: number;
  createdAt: Date;
  userId: string; //adicionado
}
