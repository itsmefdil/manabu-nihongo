import { defineConfig } from 'drizzle-kit';

const isPostgres = process.env.DB_TYPE === 'postgres';

export default defineConfig({
    schema: isPostgres ? './src/db/schema.postgres.ts' : './src/db/schema.sqlite.ts',
    out: isPostgres ? './drizzle-postgres' : './drizzle',
    dialect: isPostgres ? 'postgresql' : 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL || (isPostgres ? '' : 'file:./manabu-data.db'),
    },
});
