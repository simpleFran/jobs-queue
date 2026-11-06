import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export class MockUserRepository {
  private users: User[] = [];

  async createUser(email: string, passwordHash: string): Promise<User> {
    
    //insere no bd em memoria
    const newUser: User = {
      id: randomUUID(),
      email,
      passwordHash,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      console.log("User not found");
      return null;
    }

    return user || null;
  }
}
