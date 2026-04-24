import "dotenv/config";

import { defineConfig, env } from "prisma/config";

type PrismaEnv = {
  DIRECT_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env<PrismaEnv>("DIRECT_URL"),
  },
});
