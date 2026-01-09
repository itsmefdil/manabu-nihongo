import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schemaSqlite from './schema.sqlite.js';
import * as schemaPg from './schema.postgres.js';

// Determine database type from environment (default to sqlite)
const isPostgres = process.env.DB_TYPE === 'postgres';

let db: any;
let schema: any;

if (isPostgres) {
    console.log('Using PostgreSQL database');
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    schema = schemaPg;
    db = drizzlePg(pool, { schema });
} else {
    console.log('Using SQLite database');
    const client = createClient({
        url: process.env.DATABASE_URL || 'file:./manabu-data.db',
    });
    schema = schemaSqlite;
    db = drizzleLibsql(client, { schema });
}

export { db, schema };

