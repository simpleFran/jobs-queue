import { z } from "zod";

//Definimos o contrato do payload de criação de item
export const createItemSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Item name is required"
          : "Item name must be a string",
    })
    .trim()
    .min(3, { message: "Item name must be at least 3 characters" })
    .max(50, { message: "Item name must not be exced 50 chacters" }),
// 
})

//Extraimos o tipo TypeScript automaticamente a partir do Schema do Zod

export type CreateItemInput = z.infer<typeof createItemSchema>;
