import { beforeEach, describe, expect, it } from "vitest";
import { QueueRepository } from "../repositories/queue.repository.js";
import { QueueItem } from "../types/queue.types.js";
import { randomUUID } from "node:crypto";

import { QueueService } from "./queue.service.js";

class MockQueueRepository implements QueueRepository {
  public items: QueueItem[] = [];

  async create(name: string,userId:string): Promise<QueueItem> {
    // const fakeUserId = randomUUID(); // Generate a fake userId for testing
    const newItem: QueueItem = {
      id: randomUUID(),
      name: name,
      status: "PENDING",
      attempts: 0,
      createdAt: new Date(),
      userId
    };

    this.items.push(newItem);
    // return newItem as QueueItem;
    console.log("Novo Item", newItem);
    return newItem;
  }

  async findUserItems(): Promise<QueueItem[]> {
    return this.items;
  }

  async findPending(): Promise<QueueItem | null> {
    return this.items.find((item) => item.status === "PENDING") || null;
  }
  async updateStatusAndAttempts(
    id: string,
    status: any,
    attempts: number,
  ): Promise<void> {
    const item = this.items.find((item) => item.id === id);

    if (item) {
      item.status = status;
      item.attempts = attempts;
    }
  }
}

describe("QueueService Unit Test", () => {
  //declara  as variaveis necessarias para lidar com o servico e 'persistencia'
  let mockRepository: MockQueueRepository; //
  let queueService: QueueService;

  beforeEach(() => {
    //instancia as injeções

    mockRepository = new MockQueueRepository();
    queueService = new QueueService(mockRepository);
  });

  it("Should successfully add a new item to the queue with userId", async () => {
    const fakeUserId = randomUUID();
    
    //adiciona no bd mock
    const item = await queueService.addItem("New Task with userId", fakeUserId);

    expect(item).toBeDefined();
    expect(item.id).toBeDefined();
    expect(item.name).toBe("New Task with userId");
    expect(item.status).toBe("PENDING");
    expect(item.userId).toBe(fakeUserId);
    expect(item).toHaveProperty("userId");
  });
  // it("Should successfully add a new item to the queue", async () => {
  //   const item = await queueService.addItem("Test Task");
  //   // const item = await queueService.addItem("Test Task", randomUUIDv7());
  //   expect(item).toBeDefined();
  //   expect(item.id).toBeDefined();
  //   expect(item).toHaveProperty("id");
  //   expect(item.name).toBe("Test Task");
  //   expect(item.status).toBe("PENDING");
  //   expect(mockRepository.items.length).toBe(1);
  // });

  it("Should return null when trying to process an empety queue", async () => {
    const processed = await queueService.processNextItem();
    expect(processed).toBeNull();
  });
});
