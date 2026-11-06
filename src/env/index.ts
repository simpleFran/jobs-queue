import "dotenv/config";
import { z } from "zod";

//definimos um contrato de tudo que nosso .env deve ter
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000), //coerce converte string para number mesmo que seja string no .env
  JWT_SECRET: z.string(), // obrigatorio! sem isso a aplicação nao liga.
});

//validamos o process.env usando o schema
//safeParse() valida os dados sem lançar exceções, retornando um objeto com sucesso ou erro
// se dados parseados forem validos (success: true), caso contrario (success: false) o que indica um erro
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Erro crítico: Variáveis de ambiente inválidas ou ausentes!",
    _env.error.format(),
  );
  throw new Error("Invalid enviroments variables.");
}

export const env = _env.data;
