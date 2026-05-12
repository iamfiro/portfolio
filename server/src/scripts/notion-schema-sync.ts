import "../env.js";

import { syncNotionSchemaIfNeeded } from "../utils/notionSchemaSync.js";

async function main() {
  const result = await syncNotionSchemaIfNeeded({ applyMigration: true });

  if (!result.changed) {
    // eslint-disable-next-line no-console
    console.log("No Notion schema changes detected.");
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
