import "../env.js";

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notionToken = process.env.NOTION_TOKEN;

const notion = new Client({ auth: notionToken });
const notionToMarkdown = new NotionToMarkdown({ notionClient: notion });

export { notion, notionToMarkdown };
