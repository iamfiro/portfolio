import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import type {
  AutoFieldDefinition,
  AutoPrismaScalarType,
} from "../notion/autoFields.js";
import { uploadImagesToR2 } from "./r2.js";

function getPlainTextFromRichText(
  items: Array<{ plain_text: string }> | undefined,
) {
  return (items ?? []).map((item) => item.plain_text).join("").trim();
}

function stringify(value: unknown): string {
  return JSON.stringify(value);
}

function requireTypeMatch(
  notionPropertyName: string,
  expectedType: string,
  actualType: string,
) {
  if (expectedType !== actualType) {
    throw new Error(
      `Notion property type changed for "${notionPropertyName}": expected ${expectedType}, got ${actualType}. Run notion:schema-sync.`,
    );
  }
}

function coerceToPrismaType(
  prismaType: AutoPrismaScalarType,
  value: unknown,
): unknown {
  if (value == null) return null;

  switch (prismaType) {
    case "String":
      return String(value);
    case "Float":
      return typeof value === "number" ? value : Number(value);
    case "Boolean":
      return typeof value === "boolean" ? value : Boolean(value);
    case "DateTime":
      return value instanceof Date ? value : new Date(String(value));
    default:
      return value;
  }
}

export async function buildAutoFieldData(
  page: PageObjectResponse,
  defs: AutoFieldDefinition[],
  context?: { category: string; name: string },
): Promise<Record<string, unknown>> {
  if (defs.length === 0) return {};

  const result: Record<string, unknown> = {};

  for (const def of defs) {
    const prop = page.properties[def.notionPropertyName];
    if (!prop) {
      result[def.prismaFieldName] = null;
      continue;
    }

    requireTypeMatch(def.notionPropertyName, def.notionPropertyType, prop.type);

    let raw: unknown = null;

    switch (prop.type) {
      case "rich_text":
        raw = getPlainTextFromRichText(prop.rich_text);
        break;
      case "title":
        raw = getPlainTextFromRichText(prop.title);
        break;
      case "number":
        raw = prop.number;
        break;
      case "checkbox":
        raw = prop.checkbox;
        break;
      case "date":
        raw = prop.date?.start ? new Date(prop.date.start) : null;
        break;
      case "url":
        raw = prop.url;
        break;
      case "email":
        raw = prop.email;
        break;
      case "phone_number":
        raw = prop.phone_number;
        break;
      case "select":
        raw = prop.select?.name ?? null;
        break;
      case "status":
        raw = prop.status?.name ?? null;
        break;
      case "multi_select":
        raw = stringify(prop.multi_select.map((item) => item.name));
        break;
      case "relation":
        raw = stringify(prop.relation.map((item) => item.id));
        break;
      case "files": {
        const urls = prop.files
          .map((file) => {
            if (file.type === "external" && "external" in file) {
              return file.external.url;
            }
            if (file.type === "file" && "file" in file) {
              return file.file.url;
            }
            return null;
          })
          .filter((url): url is string => Boolean(url));

        if (urls.length > 0 && context) {
          try {
            const r2Urls = await uploadImagesToR2(urls, {
              category: context.category,
              name: context.name,
              label: def.prismaFieldName,
            });
            raw = stringify(r2Urls);
          } catch {
            raw = stringify(urls);
          }
        } else {
          raw = stringify(urls);
        }
        break;
      }
      case "people":
        raw = stringify(prop.people.map((person) => person.id));
        break;
      case "created_time":
        raw = prop.created_time ? new Date(prop.created_time) : null;
        break;
      case "last_edited_time":
        raw = prop.last_edited_time ? new Date(prop.last_edited_time) : null;
        break;
      default:
        raw = stringify(prop);
        break;
    }

    result[def.prismaFieldName] = coerceToPrismaType(def.prismaFieldType, raw);
  }

  return result;
}
