import "../env.js";

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { notion } from "./notion.js";
import { autoFields } from "../notion/autoFields.js";

import type {
  AutoFieldDefinition,
  AutoModel,
  AutoPrismaScalarType,
} from "../notion/autoFields.js";

type NotionPropertyType = string;

interface DbConfig {
  model: AutoModel;
  envName: "NOTION_BLOG_DB_ID" | "NOTION_PROJECT_DB_ID" | "NOTION_AWARD_DB_ID" | "NOTION_STACK_DB_ID";
  knownProps: string[];
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is not configured on server`);
  return value;
}

function normalizeToPrismaIdentifier(input: string) {
  const trimmed = input.trim();

  const replaced = trimmed
    .replace(/\s+/g, "_")
    // Keep unicode letters/numbers/underscore; replace everything else.
    .replace(/[^\p{L}\p{N}_]/gu, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (replaced.length === 0) return "prop";
  if (/^\p{N}/u.test(replaced)) return `_${replaced}`;
  return replaced;
}

function buildAutoFieldName(model: AutoModel, notionPropertyName: string) {
  const normalized = normalizeToPrismaIdentifier(notionPropertyName);
  return `notion_${model}_${normalized}`;
}

function escapePrismaString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
}

function notionTypeToPrismaScalar(type: NotionPropertyType): AutoPrismaScalarType {
  switch (type) {
    case "number":
      return "Float";
    case "checkbox":
      return "Boolean";
    case "date":
    case "created_time":
    case "last_edited_time":
      return "DateTime";
    default:
      return "String";
  }
}

function getServerRootDir() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  // server/src/utils -> server
  return path.resolve(dirname, "../..");
}

function getPrismaSchemaPath(serverRoot: string) {
  return path.join(serverRoot, "prisma", "schema.prisma");
}

function renderAutoFieldsFile(next: Record<AutoModel, AutoFieldDefinition[]>) {
  const toJson = (value: unknown) => JSON.stringify(value, null, 2);

  return `export type AutoModel = \"post\" | \"project\" | \"award\" | \"stack\";\n\nexport type AutoPrismaScalarType = \"String\" | \"Float\" | \"Boolean\" | \"DateTime\";\n\nexport interface AutoFieldDefinition {\n  notionPropertyName: string;\n  notionPropertyType: string;\n  prismaFieldName: string;\n  prismaFieldType: AutoPrismaScalarType;\n  prismaDbColumnName?: string;\n}\n\nexport const autoFields: Record<AutoModel, AutoFieldDefinition[]> = ${toJson(
    next,
  )} as const;\n`;
}

function insertFieldsIntoModel(
  schemaText: string,
  modelName: string,
  fieldLines: string[],
) {
  const startMarker = "  // --- Notion Auto Fields (generated) ---";
  const endMarker = "  // --- Notion Auto Fields End ---";

  const modelHeader = `model ${modelName} {`;
  const modelStartIndex = schemaText.indexOf(modelHeader);
  if (modelStartIndex === -1) {
    throw new Error(`Model ${modelName} not found in schema.prisma`);
  }

  const modelEndIndex = schemaText.indexOf("}\n", modelStartIndex);
  if (modelEndIndex === -1) {
    throw new Error(`Model ${modelName} block not closed in schema.prisma`);
  }

  const modelBlock = schemaText.slice(modelStartIndex, modelEndIndex + 2);
  const startIndexInBlock = modelBlock.indexOf(startMarker);
  const endIndexInBlock = modelBlock.indexOf(endMarker);
  if (startIndexInBlock === -1 || endIndexInBlock === -1) {
    throw new Error(
      `Auto field markers not found for model ${modelName}. Re-run schema update or add markers.`,
    );
  }

  const before = modelBlock.slice(0, startIndexInBlock + startMarker.length);
  const between = modelBlock.slice(
    startIndexInBlock + startMarker.length,
    endIndexInBlock,
  );
  const after = modelBlock.slice(endIndexInBlock);

  const existingLines = new Set(
    between
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

  const nextLines = fieldLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .filter((l) => !existingLines.has(l))
    .map((l) => `  ${l}`);

  if (nextLines.length === 0) {
    return { updated: false, schemaText };
  }

  const newBetween = `${between.replace(/\n\s*$/, "\n")}${nextLines.join(
    "\n",
  )}\n`;

  const newModelBlock = `${before}${newBetween}${after}`;
  const newSchemaText =
    schemaText.slice(0, modelStartIndex) +
    newModelBlock +
    schemaText.slice(modelEndIndex + 2);

  return { updated: true, schemaText: newSchemaText };
}

function renameFieldsInModelAutoBlock(
  schemaText: string,
  modelName: string,
  renameMap: Map<string, string>,
) {
  if (renameMap.size === 0) {
    return { updated: false, schemaText };
  }

  const startMarker = "  // --- Notion Auto Fields (generated) ---";
  const endMarker = "  // --- Notion Auto Fields End ---";

  const modelHeader = `model ${modelName} {`;
  const modelStartIndex = schemaText.indexOf(modelHeader);
  if (modelStartIndex === -1) {
    throw new Error(`Model ${modelName} not found in schema.prisma`);
  }

  const modelEndIndex = schemaText.indexOf("}\n", modelStartIndex);
  if (modelEndIndex === -1) {
    throw new Error(`Model ${modelName} block not closed in schema.prisma`);
  }

  const modelBlock = schemaText.slice(modelStartIndex, modelEndIndex + 2);
  const startIndexInBlock = modelBlock.indexOf(startMarker);
  const endIndexInBlock = modelBlock.indexOf(endMarker);
  if (startIndexInBlock === -1 || endIndexInBlock === -1) {
    throw new Error(
      `Auto field markers not found for model ${modelName}. Re-run schema update or add markers.`,
    );
  }

  const before = modelBlock.slice(0, startIndexInBlock + startMarker.length);
  const between = modelBlock.slice(
    startIndexInBlock + startMarker.length,
    endIndexInBlock,
  );
  const after = modelBlock.slice(endIndexInBlock);

  const nextBetweenLines = between.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    // first token is the field name
    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1) return line;
    const fieldName = trimmed.slice(0, firstSpace);

    const replacement = renameMap.get(fieldName);
    if (!replacement) return line;

    return `  ${replacement}`;
  });

  const nextBetween = nextBetweenLines.join("\n");
  if (nextBetween === between) {
    return { updated: false, schemaText };
  }

  const newModelBlock = `${before}${nextBetween}${after}`;
  const newSchemaText =
    schemaText.slice(0, modelStartIndex) +
    newModelBlock +
    schemaText.slice(modelEndIndex + 2);

  return { updated: true, schemaText: newSchemaText };
}

function formatPrismaFieldLine(def: AutoFieldDefinition) {
  const base = `${def.prismaFieldName} ${def.prismaFieldType}?`;
  if (!def.prismaDbColumnName) return base;
  return `${base} @map("${escapePrismaString(def.prismaDbColumnName)}")`;
}

async function getDatabasePropertyTypes(databaseId: string) {
  const response = await notion.databases.retrieve({ database_id: databaseId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: Record<string, { type: string }> = (response as any).properties;

  const entries = Object.entries(props).map(([name, cfg]) => ({
    name,
    type: cfg.type,
  }));

  return entries;
}

export interface NotionSchemaSyncOptions {
  applyMigration?: boolean;
  migrateNamePrefix?: string;
}

export async function syncNotionSchemaIfNeeded(
  options: NotionSchemaSyncOptions = {},
) {
  const serverRoot = getServerRootDir();
  const schemaPath = getPrismaSchemaPath(serverRoot);

  const configs: DbConfig[] = [
    {
      model: "post",
      envName: "NOTION_BLOG_DB_ID",
      knownProps: [
        "이름",
        "요약",
        "썸네일",
        "작성일",
        "카테고리",
        "프로젝트",
      ],
    },
    {
      model: "project",
      envName: "NOTION_PROJECT_DB_ID",
      knownProps: [
        "이름",
        "설명",
        "썸네일",
        "Github 주소",
        "배포 주소",
        "시작일",
        "종료일",
        "기술 스택",
      ],
    },
    {
      model: "award",
      envName: "NOTION_AWARD_DB_ID",
      knownProps: ["상 이름", "주최 / 수여 기관", "날짜", "관련 이미지", "프로젝트"],
    },
    {
      model: "stack",
      envName: "NOTION_STACK_DB_ID",
      knownProps: ["이름", "이미지"],
    },
  ];

  const nextAutoFields: Record<AutoModel, AutoFieldDefinition[]> = {
    post: [...autoFields.post],
    project: [...autoFields.project],
    award: [...autoFields.award],
    stack: [...autoFields.stack],
  };

  let hasAnyChange = false;
  let schemaText = readFileSync(schemaPath, "utf8");

  // Rename legacy hashed field names to human-readable names while preserving
  // the existing DB column by mapping to the old name via @map.
  for (const cfg of [
    { model: "post" as const, modelName: "Post" },
    { model: "project" as const, modelName: "Project" },
    { model: "award" as const, modelName: "Award" },
    { model: "stack" as const, modelName: "Stack" },
  ]) {
    const used = new Set(nextAutoFields[cfg.model].map((d) => d.prismaFieldName));
    const renames = new Map<string, string>();

    for (const def of nextAutoFields[cfg.model]) {
      if (!def.prismaFieldName.startsWith("notionProp_")) continue;

      let candidate = buildAutoFieldName(cfg.model, def.notionPropertyName);
      if (used.has(candidate)) {
        let i = 2;
        while (used.has(`${candidate}_${i}`)) i += 1;
        candidate = `${candidate}_${i}`;
      }

      used.add(candidate);

      const oldFieldName = def.prismaFieldName;
      def.prismaFieldName = candidate;
      def.prismaDbColumnName = oldFieldName;

      renames.set(oldFieldName, formatPrismaFieldLine(def));
    }

    const renamed = renameFieldsInModelAutoBlock(
      schemaText,
      cfg.modelName,
      renames,
    );

    schemaText = renamed.schemaText;
    if (renamed.updated) {
      hasAnyChange = true;
    }
  }

  for (const cfg of configs) {
    requireEnv(process.env.NOTION_TOKEN, "NOTION_TOKEN");
    const databaseId = requireEnv(process.env[cfg.envName], cfg.envName);

    const propertyTypes = await getDatabasePropertyTypes(databaseId);

    const existing = new Map(
      nextAutoFields[cfg.model].map((d) => [d.notionPropertyName, d]),
    );

    const newDefs: AutoFieldDefinition[] = [];

    for (const prop of propertyTypes) {
      if (cfg.knownProps.includes(prop.name)) continue;
      if (existing.has(prop.name)) continue;

      // ignore Notion internal-ish names if they ever appear
      if (prop.name.trim().length === 0) continue;

      const def: AutoFieldDefinition = {
        notionPropertyName: prop.name,
        notionPropertyType: prop.type,
        prismaFieldName: buildAutoFieldName(cfg.model, prop.name),
        prismaFieldType: notionTypeToPrismaScalar(prop.type),
        prismaDbColumnName: prop.name,
      };

      newDefs.push(def);
    }

    if (newDefs.length === 0) continue;

    nextAutoFields[cfg.model].push(...newDefs);
    hasAnyChange = true;

    const fieldLines = newDefs.map(formatPrismaFieldLine);
    const modelName =
      cfg.model === "post"
        ? "Post"
        : cfg.model === "project"
          ? "Project"
          : cfg.model === "award"
            ? "Award"
            : "Stack";

    const { updated, schemaText: nextSchemaText } = insertFieldsIntoModel(
      schemaText,
      modelName,
      fieldLines,
    );

    schemaText = nextSchemaText;
    if (updated) {
      // keep hasAnyChange already true
    }
  }

  if (!hasAnyChange) {
    return { changed: false };
  }

  // Persist schema + generated autoFields list
  writeFileSync(schemaPath, schemaText, "utf8");

  const autoFieldsPath = path.join(serverRoot, "src", "notion", "autoFields.ts");
  writeFileSync(autoFieldsPath, renderAutoFieldsFile(nextAutoFields), "utf8");

  if (options.applyMigration === false) {
    return { changed: true, migrated: false };
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const prefix = options.migrateNamePrefix ?? "notion_auto";
  const migrationName = `${prefix}_${timestamp}`;

  const migrate = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "migrate", "dev", "--name", migrationName],
    {
      cwd: serverRoot,
      stdio: "inherit",
      env: process.env,
    },
  );

  if (migrate.status !== 0) {
    throw new Error(`Prisma migrate failed (exit ${migrate.status ?? "?"}).`);
  }

  const gen = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["prisma", "generate"],
    {
      cwd: serverRoot,
      stdio: "inherit",
      env: process.env,
    },
  );

  if (gen.status !== 0) {
    throw new Error(`Prisma generate failed (exit ${gen.status ?? "?"}).`);
  }

  return { changed: true, migrated: true };
}
