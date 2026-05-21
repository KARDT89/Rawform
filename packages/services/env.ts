import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("URL for connecting to the database"),
  JWT_SECRET: z.string().describe("Secret key used for signing JWT tokens"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
