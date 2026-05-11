const KOREAN_CHARS_PER_MIN = 500;
const WORDS_PER_MIN = 200;

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6} /g, "")
    .replace(/[*_~]/g, "")
    .trim();
}

export function calculateReadingTime(content: string): number {
  const text = stripMarkdown(content);
  const koreanChars = (text.match(/[가-힣ㄱ-ㆎ]/g) ?? []).length;
  const nonKorean = text.replace(/[가-힣ㄱ-ㆎ\s]/g, " ").trim();
  const words = nonKorean.split(/\s+/).filter(Boolean).length;

  const minutes = koreanChars / KOREAN_CHARS_PER_MIN + words / WORDS_PER_MIN;
  return Math.max(1, Math.round(minutes));
}
