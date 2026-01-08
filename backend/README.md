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

## API Documentation

Detailed API endpoints and examples are documented in [API.md](./API.md).

