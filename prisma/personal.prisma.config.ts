import { config } from 'dotenv'
import { defineConfig } from 'prisma/config';

config({ path: '../.env.local' })

export default defineConfig({
  schema: './personal/schema.prisma',
  migrations: {
    path: './personal/migrations',
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses connection pooler)
		// Falls back to DATABASE_URL if DIRECT_URL is not set (e.g., during build/generate)
		url: process.env.PERSONAL_DIRECT_URL || process.env.PERSONAL_DATABASE_URL || '',
  },
});
