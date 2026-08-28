const POSTGRES_PROTOCOLS = new Set(["postgres:", "postgresql:"]);

export function requirePostgresDatabaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error("DATABASE_URL is not configured on server");
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
  }

  if (!POSTGRES_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("DATABASE_URL must use the postgresql:// or postgres:// protocol");
  }

  return value;
}
