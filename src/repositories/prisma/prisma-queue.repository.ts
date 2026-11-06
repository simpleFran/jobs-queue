import { PrismaClient } from "@prisma/client";
import { QueueItem } from "../../types/queue.types.js";
import { QueueRepository } from "../queue.repository.js";
import { prisma } from "../../lib/prisma.js";

// const prisma = new PrismaClient();

export class PrismaQueueRepository implements QueueRepository {
  async create(name: string, userId: string): Promise<QueueItem> {
    const newItem = await prisma.item.create({
      data: { name, userId },
    });

    return newItem as QueueItem;
  }
  async findUserItems(userId: string): Promise<QueueItem[]> {
    const items = await prisma.item.findMany({
      where: {
        userId,
      },
    });
    return items as QueueItem[];
  }

  async findPending(): Promise<QueueItem | null> {
    const items = await prisma.item.findFirst({
      where: {
        status: "PENDING",
      },
      orderBy: { createdAt: "asc" }, // o mais antigo primeiro (FIFO)
    });

    return items as QueueItem | null;
  }

  async updateStatusAndAttempts(
    id: string,
    status: any,
    attempts: number,
  ): Promise<void> {
    await prisma.item.update({
      where: {
        id,
      },
      data: {
        status,
        attempts,
      },
    });
  }
}
