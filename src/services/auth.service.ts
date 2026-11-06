import { MockUserRepository } from "../repositories/prisma/in-memmory-user.repository.js";
import { PrismaUserRepository } from "../repositories/prisma/prisma-user.repository.js";
import bcrypt from "bcryptjs";

export class AuthService {
  userRepository = new PrismaUserRepository();
  // userRepository = new MockUserRepository();

  async login(email: string, password: string) {
    // procura usuario pelo email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    // 2. Compara a senha digitada com o hash guardado no banco
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Invalid credentials.");
    }
    return { id: user.id, email: user.email };
  }

  async register(email: string, password: string) {
    //1. Verifica se ja existe o email cadastrado
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already registered.");
    }

    //2. Transforma a senha em um Hash seguro
    const passwordHash = await bcrypt.hash(password, 10);

    //3. Salva no BD
    const user = await this.userRepository.createUser(email, passwordHash);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
