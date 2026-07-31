import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client.js";

import { requirePostgresDatabaseUrl } from "./databaseUrl.js";

import "../env.js";

const connectionString = requirePostgresDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
