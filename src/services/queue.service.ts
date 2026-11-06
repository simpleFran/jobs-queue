import { QueueRepository } from "../repositories/queue.repository.js";
import { QueueItem } from "../types/queue.types.js";

export class QueueService {
  // private items: QueueItem[] = [];

  constructor(private queueRepository: QueueRepository) {}
  //add a item
  async addItem(name: string, userId: string): Promise<QueueItem> {
    const newItem = await this.queueRepository.create(name, userId);

    return newItem;
  }

  //return all items
  async listUserItems(userId: string): Promise<QueueItem[]> {
    return await this.queueRepository.findUserItems(userId);
  }

  async processNextItem(): Promise<QueueItem | null> {
    const item = await this.queueRepository.findPending();

    if (!item) {
      console.log("📭 No pending items in the queue.");
      return null;
    }

    // const item = pendingItems[0];

    const newAttempts = item.attempts + 1;
    //change to 'PROCESSING
    await this.queueRepository.updateStatusAndAttempts(
      item.id,
      "PROCESSING",
      newAttempts,
    );

    console.log(`Processing item: [${item.id}] -> ${item.name}...`);

    //simulating a 2 seconds dealy with async/await
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 2000);
    });

    //70% chance of success, 30% chance of failuer
    const randomValue = Math.random();

    const isSucess = randomValue > 0.3;

    const finalStatus = isSucess ? "SUCCESS" : "FAILED";

    await this.queueRepository.updateStatusAndAttempts(
      item.id,
      finalStatus,
      item.attempts,
    );
    if (isSucess) {
      item.status = "SUCCESS";
      console.log(`Item [${item.id}] processed with success.`);
    } else {
      item.status = "FAILED";
      console.log(`Item [${item.id}] FAILED during processing.`);
    }

    return item;
  }

  // public async runTest() {
  //   const queue = new QueueService();

  //   // Add same items
  //   queue.addItem("Send Welcome Email");
  //   queue.addItem("Generating Financial Report");
  //   queue.addItem("Sync Customer Data");

  //   console.log("--- INITIAL QUEUE STATE ---");

  //   console.log(queue.listAllItems());

  //   console.log("\n--- STARTING ITEM PROCESSING ---");

  //   await queue.processNextItem();
  //   await queue.processNextItem();

  //   console.log("\n--- FINAL QUEUE STATE ---");
  // }
}

// ---Test execution script---

// runTest();
