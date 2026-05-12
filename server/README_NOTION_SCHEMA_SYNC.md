# Notion Schema Auto Migration (Strict Schema)

This server uses **Notion as the source of truth**, but serves data from the **local SQLite DB**.

When you add a **new property (column)** in a Notion database, Prisma/SQLite does **not** update automatically unless you run the schema sync.

## What this does

- Detects newly added Notion properties in:
  - Blog (Posts)
  - Projects
  - Awards
  - Stack
- Auto-adds **new optional columns** to Prisma models (`notionProp_<hash>`)
- Runs:
  - `prisma migrate dev`
  - `prisma generate`
- After that, `/notion-sync` will **also backup** the new property values into those columns.

## Usage (recommended)

From `server/`:

- One-time schema sync:
  - `npm run notion:schema-sync`

Then run data sync:

- `GET /notion-sync?token=<NOTION_SYNC_TOKEN>`

## Optional: run on server start (dev only)

If you want the server to attempt schema sync on startup:

- Set `NOTION_AUTO_MIGRATE=1`
- Then run `npm run dev`

Notes:
- This is intended for local development. In many hosting environments you **should not** run migrations on startup.
- If Prisma detects drift or requires a reset, you must handle that manually.
