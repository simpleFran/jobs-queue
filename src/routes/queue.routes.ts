import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { CreateItemInput, createItemSchema } from "../schemas/queue.schema.js";
import { QueueService } from "../services/queue.service.js";
import { PrismaQueueRepository } from "../repositories/prisma/prisma-queue.repository.js";

// Injeção de dependência manual (Composition Root)
const queueRepository = new PrismaQueueRepository();
const queueService = new QueueService(queueRepository);

export async function queueRoutes(serverInstance: FastifyInstance) {
  //Hook de segurança local para todas as rotas do grupo /queue
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify(); // se o token falhar lança exceção
      // console.log(request.jwtVerify());
    } catch (error) {
      return reply
        .status(401)
        .send({ error: "Unauthorized: Invalid or missing token" });
    }
  };
  //// Rota Protegida: Criar Item
  serverInstance.post<{ Body: CreateItemInput }>(
    "/item",
{
  preHandler:[authenticate]
},
    async (request, reply) => {
      // Se o body for invalido, o Zod dispara o erro imediatamente
      // e é capturado pelo Global Error Handler do Fastify
      const { name } = createItemSchema.parse(request.body);
      const userId = request.user.id
      const newItem = await queueService.addItem(name, userId);

      return reply.status(201).send({a:
        newItem.status
      });
    },
  );

  //2. rota para listar todos os itens de um determinado User
  serverInstance.get(
    "/items",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const userId = request.user.id;
      // console.log("user id - ", userId);
      const items = await queueService.listUserItems(userId);
      return reply.status(200).send(items);
    },
  );

  // const {userId} = request.user.id; -> estava assim
  // como estivesse desestruturando um objeto (está correto o termo?) e estava findo como undefined e nao estava filtrando por userId
  //no service e estava me dando TODOS OS ITEMS
  // QUANDO MUDEI  para -> const userId = request.user.id; deu certo filtrou...
  // 2 duvidas -> 1 pq passou no service de queue? nao deveria reclamar ja que veio undefined?
  // -> em request.user.id em cima de id esta me dando -> Property 'id' does not exist on type 'string | object | Buffer<ArrayBufferLike>'.
  // Property 'id' does not exist on type 'string', porem esta passando

  //3. Processar item
  serverInstance.post("/process", async (_, reply) => {
    const processedItem = await queueService.processNextItem();

    // console.log(
    //   "METODO processNextItem ITEM ATRIBUIDO A VARIAVEL processedItem",
    //   processedItem,
    // );
    if (!processedItem) {
      return reply
        .status(200)
        .send({ message: "No pending items in the queue to process." });
    }
    return reply.status(200).send({
      message: "Processing cycle executed successfully",
      item: processedItem,
    });
  });
}
