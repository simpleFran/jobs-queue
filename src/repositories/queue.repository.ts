import { QueueItem } from "../types/queue.types.js";

export interface QueueRepository {
  create(name: string, userId: string): Promise<QueueItem>;
  findUserItems(userId: string): Promise<QueueItem[]>;
  findPending(): Promise<QueueItem | null>;
  updateStatusAndAttempts(
    id: string,
    status: any,
    attempts: number,
  ): Promise<void>;
}
