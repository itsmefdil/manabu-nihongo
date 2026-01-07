# Manabu Backend

The API server for the Manabu learning platform.

## Configuration

- **Port**: Defaults to `3333`. (See `src/index.ts`)
- **Database**: SQLite with Drizzle ORM (`manabu.db`).

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
Migrations are handled via Drizzle Kit.

```bash
# Push schema changes to database
bun run db:push

# View database with Drizzle Studio
bun run db:studio
```

## API Documentation

Detailed API endpoints and examples are documented in [API.md](./API.md).

