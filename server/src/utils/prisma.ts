import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
// server/src/utils/ → ../../dev.db → server/dev.db (absolute, CWD-independent)
const dbPath = join(__dirname, "../../dev.db");

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
