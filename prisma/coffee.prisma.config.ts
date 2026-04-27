import { config } from 'dotenv'
import { defineConfig } from 'prisma/config';

config({ path: '../.env.local' })

export default defineConfig({
  schema: './coffee/schema.prisma',
  migrations: {
    path: './coffee/migrations',
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses connection pooler)
		// Falls back to DATABASE_URL if DIRECT_URL is not set (e.g., during build/generate)
		url: process.env.COFFEE_DIRECT_URL || process.env.COFFEE_DATABASE_URL || '',
  },
});
