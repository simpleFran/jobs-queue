import { beforeEach, describe, expect, it } from "vitest";
import { MockUserRepository } from "../repositories/prisma/in-memmory-user.repository.js";
import { AuthService } from "./auth.service.js";

// 1. Mock do Repositório de Usuários em Memória
// class MockUserRepository {
//   private users: User[] = [];

//   async createUser(email: string, password: string): Promise<User> {
//     //verifica se na existe no bd

//     const userAlreadyExists = this.users.find((user) => user.email === email);
//     if (userAlreadyExists) {
//       throw new Error("User already exists");
//     }

//     //hashear a senha
//     const passwordHash = await bcrypt.hash(password, 10);

//     //insere no bd em memoria
//     const newUser: User = {
//       id: randomUUID(),
//       email,
//       passwordHash,
//       createdAt: new Date(),
//     };
//     this.users.push(newUser);
//     return newUser;
//   }

//   async getUserByEmail(email: string): Promise<User | null> {
//     const user = this.users.find((user) => user.email === email);
//     if (!user) {
//       console.log("User not found");
//       return null;
//     }

//     return user || null;
//   }
// }

describe("Authenticate Service (Unit Test) ", () => {
  let mockUsersRepo: MockUserRepository;
  let authService: AuthService;

  beforeEach(() => {
    mockUsersRepo = new MockUserRepository();
    authService = new AuthService();
  });

  it("Should be register a new user and not return passwordHash", async () => {
    //Arrange
    const email = "frank.m.camargo@gmail.com";
    const password = "Re2011#amor";

    // Act
    const result = await authService.register(email, password);

    //Assert (Usando toHaveProperty e toBe)
    expect(result).toHaveProperty("id");
    expect(result.email).toBe(email);

    //Garante extritamente que o passwordHash não seja retornado
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("Should be able to login with valid credentials", async () => {
    //cria um usuario
    const email = "frank.m.camargo@gmail.com";
    const password = "Re2011#amor";
    //Auth service cria o user no bd na memoria
    await authService.register(email, password);

    //Act -> tentamos logar
    const result = await authService.login(email, password);

    //Assert
    expect(result).toHaveProperty("id");
    expect(result.email).toBe(email);
  });
});
