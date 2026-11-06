import { FastifyInstance } from "fastify";
import z from "zod";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email({ error: "Invalid E-mail" }),
  password: z.string(),
});

export function authRoutes(serverInstance: FastifyInstance) {
  // Rota pública de cadastro
  serverInstance.post("/auth/register", async (request, reply) => {
    try {
      const { email, password } = registerSchema.parse(request.body);
      const user = await authService.register(email, password);

      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  //Rota pública de login (Gera Token JWT)

  serverInstance.post(
    "/auth/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = loginSchema.parse(request.body);
        // console.log('request.body', request.body);
        // console.log('ta chegando')
        const user = await authService.login(email, password);

        //Assina o token JWT com validade de 1 dia
        const token = serverInstance.jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          { expiresIn: "1d" },
        );

        return reply.status(200).send({ message: "Login Successful", token });
      } catch (error: any) {
        return reply.status(401).send({ error: error.message });
      }
    },
  );

  serverInstance.get("/me", async (request, reply) => {
    return reply.status(200).send({ message: "Chegou" });
  });
}
