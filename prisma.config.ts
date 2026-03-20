import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma reads .env by default, not .env.local — load it explicitly
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
