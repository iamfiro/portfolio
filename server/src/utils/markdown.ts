export function parseMarkdown(
  markdown: string,
  filename: string,
): {
  content: string;
  [key: string]: string | string[] | Date;
} {
  const lines = markdown.split("\n");
  let metadataStart = -1;
  let metadataEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      if (metadataStart === -1) {
        metadataStart = i;
      } else {
        metadataEnd = i;
        break;
      }
    }
  }

  if (metadataStart !== -1 && metadataEnd !== -1) {
    const metadataLines = lines.slice(metadataStart + 1, metadataEnd);
    const metadataObject = metadataLines.reduce(
      (acc, curr) => {
        const trimmed = curr.trim();
        if (trimmed && trimmed.includes(": ")) {
          const [key, ...valueParts] = trimmed.split(": ");
          const value = valueParts.join(": ").trim();

          // 특별한 타입 변환 처리
          if (key === "tags") {
            acc[key] = parseTags(value);
          } else if (key === "date") {
            acc[key] = new Date(value);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      },
      {} as Record<string, string | string[] | Date>,
    );

    const contentLines = lines.slice(metadataEnd + 1);
    const content = contentLines.join("\n").trim();

    return {
      content: content,
      title: filename.replace(".md", ""),
      ...metadataObject,
    };
  }

  return {
    content: markdown,
    title: filename.replace(".md", ""),
  };
}

function parseTags(tagsString?: string): string[] {
  if (!tagsString) return [];

  // [tag1, tag2, tag3] 형식 파싱
  const match = tagsString.match(/\[(.*?)\]/);
  if (match) {
    return match[1]
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  // 쉼표로 구분된 형식도 지원
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
