export type FrontmatterValue = string | string[];

export interface ParsedMarkdown {
  fields: Record<string, FrontmatterValue>;
  content: string;
}

export interface MarkdownEntry extends ParsedMarkdown {
  id: string;
}

/**
 * `---`로 감싸인 frontmatter 블록과 본문을 분리해 파싱합니다.
 * `[a, b]` 형태의 값은 문자열 배열로, 그 외에는 문자열로 취급합니다.
 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const lines = raw.split("\n");
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (start === -1) {
        start = i;
      } else {
        end = i;
        break;
      }
    }
  }

  if (start === -1 || end === -1) {
    return { fields: {}, content: raw.trim() };
  }

  const fields: Record<string, FrontmatterValue> = {};
  for (const line of lines.slice(start + 1, end)) {
    const trimmed = line.trim();
    const separatorIndex = trimmed.indexOf(":");
    if (!trimmed || separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    fields[key] = parseFieldValue(value);
  }

  const content = lines
    .slice(end + 1)
    .join("\n")
    .trim();

  return { fields, content };
}

function parseFieldValue(value: string): FrontmatterValue {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}

/** glob으로 읽어온 `{경로: 원본 문자열}` 맵을 슬러그(id)가 붙은 파싱 결과 배열로 변환합니다. */
export function loadMarkdownEntries(
  modules: Record<string, string>,
): MarkdownEntry[] {
  return Object.entries(modules).map(([path, raw]) => {
    const id = path.split("/").pop()!.replace(/\.md$/, "");
    return { id, ...parseFrontmatter(raw) };
  });
}

export function asString(value: FrontmatterValue | undefined): string {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

export function asNullableString(
  value: FrontmatterValue | undefined,
): string | null {
  const str = asString(value);
  return str.length > 0 ? str : null;
}

export function asArray(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}
