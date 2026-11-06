import Fastify from "fastify";
import { queueRoutes } from "../src/routes/queue.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import jwt from "@fastify/jwt";
import { env } from "./env/index.js";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import { ZodError } from "zod";

const server = Fastify({ logger: false });

//Registra o plugin do Helmet (Blindagem de cabeçalhos HTTP)
await server.register(fastifyHelmet);

// Registra o plugin do CORS para permitir requisições de diferentes origens
await server.register(fastifyCors, {
  origin: true, // Permite todas as origens (pode ser ajustado para permitir apenas origens específicas)
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
});

//registra o plugin do Rate Limit globalmente para todas as rotas
await server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Registra o plugin do JWT (Chave secreta para assinar os tokens)
server.register(jwt, {
  secret: env.JWT_SECRET,
  // secret: process.env.JWT_SECRET!,
});
//plugin de rotas da fila
server.register(queueRoutes);
//plugin de rotas auth
server.register(authRoutes);

// --- GLOBAL ERROR HANDLER ---

server.setErrorHandler((error, request, reply) => {
  if (
    error instanceof Error &&
    "statusCode" in error &&
    error.statusCode === 429
  ) {
    request.log.warn(error); // Log opcional
    return reply.status(429).send({
      statusCode: 429,
      error: "Too Many Requests",
      message: error.message, // Mensagem gerada pelo errorResponseBuilder
    });
  }

  // se o erro veio do Zod (Falha de validação)

  if (error instanceof ZodError) {
    // const issues = error.issues.map((issue) => issue.message);
    // Se o erro veio do rate-limit, ele terá o statusCode 429 anexado automaticamente

    return reply.status(400).send({
      error: "Validation Error",
      messages: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: error.issues.map((issue) => issue.message),
    });
  }
  // para qualquer outro erro inesperado do sistem (bug, bd crash, etc)
  server.log.error(error); // Loga o erro internamente para o time de dev ver

  return reply.status(500).send({
    error: "Internal Server Error",
    message: "An unexpected error occurred on the server.",
  });

  
});

//subir servidor
export async function startServer() {
  try {
    await server.listen({ port: 3333 }, () => {
      console.log("🚀 HTTP Server running on http://localhost:3333");
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}
