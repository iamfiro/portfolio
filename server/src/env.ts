import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as dotenvConfig } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenvConfig({ path: resolve(__dirname, "../../.env") });
dotenvConfig({ path: resolve(__dirname, "../.env") });
