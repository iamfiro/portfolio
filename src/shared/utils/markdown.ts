export function parseMarkdown(markdown: string): {
  title: string;
  date: Date;
  desc: string;
  thumbnail: string;
  tags: string[];
  content: string;
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
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const contentLines = lines.slice(metadataEnd + 1);
    const content = contentLines.join("\n").trim();

    return {
      title: metadataObject.title || "",
      date: metadataObject.date ? new Date(metadataObject.date) : new Date(),
      desc: metadataObject.desc || "",
      thumbnail: metadataObject.thumbnail || "",
      tags: parseTags(metadataObject.tags),
      content: content,
    };
  }

  return {
    title: "",
    date: new Date(),
    desc: "",
    thumbnail: "",
    tags: [],
    content: markdown,
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
