# Manabu Backend

The API server for the Manabu learning platform.

## Configuration
    
- **Port**: Defaults to `3333`. (See `src/index.ts`)
- **Database**: SQLite (default) or PostgreSQL. Configured via `DB_TYPE` in `.env`.

### Environment Variables
Copy `.env.example` to `.env` and adjust as needed.

```bash
# Default (SQLite)
DB_TYPE=sqlite
DATABASE_URL=file:./manabu-data.db

# For PostgreSQL
# DB_TYPE=postgres
# DATABASE_URL=postgresql://user:password@localhost:5432/manabu
```

## Commands

### Install Dependencies
```bash
bun install
```

### Run in Development Mode
```bash
bun run dev
```

### Database Management
Migrations are handled via Drizzle Kit. Commands automatically adapt to the configured `DB_TYPE`.

```bash
# Generate migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema changes to database (prototyping only, mainly for SQLite)
bun run db:push

# View database with Drizzle Studio
bun run db:studio
```

### Migration: SQLite to PostgreSQL

To migrate your existing data from SQLite to PostgreSQL:

1.  **Prepare PostgreSQL**: Ensure you have a PostgreSQL database running and an empty database created.
2.  **Configure Environment**: Update your `.env` file with the PostgreSQL connection string. You can verify it works by running `bun run db:push`.
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/manabu
    ```
3.  **Run Migration Script**: Execute the migration script. It will read from the local SQLite file (`manabu-data.db`) and insert data into the PostgreSQL database defined in `DATABASE_URL`.
    ```bash
    bun run migrate:pg
    ```
4.  **Switch Application**: Update your `.env` to use the postgres driver.
    ```env
    DB_TYPE=postgres
    ```
5.  **Restart**: Restart your backend server.

## API Documentation

Detailed API endpoints and examples are documented in [API.md](./API.md).

