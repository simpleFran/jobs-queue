import { prisma } from "../../lib/prisma.js";
import { User } from "../../types/user.types.js";

export class PrismaUserRepository {
  async createUser(email: string, passwordHash: string): Promise<User> {
    const newUser = await prisma.user.create({
      data: { email, passwordHash },
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
