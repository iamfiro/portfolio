// 읽기 속도 기준값
const KOREAN_CHARS_PER_MIN = 500; // 한글 묵독 속도 (음절/분)
const WORDS_PER_MIN = 200; // 영문·숫자 등 기술 문서 단어 속도 (단어/분)
const CODE_SECONDS_PER_LINE = 2; // 코드는 훑어 읽는 줄 단위로 계산
const MATH_INLINE_SECONDS = 2;
const MATH_BLOCK_SECONDS = 8;

// 이미지: 첫 장 12초부터 장마다 1초씩 줄어 최소 3초 (Medium 방식)
const IMAGE_FIRST_SECONDS = 12;
const IMAGE_MIN_SECONDS = 3;

const HANGUL = /[가-힣ㄱ-ㆎ]/g;

interface ContentParts {
  text: string;
  codeLines: number;
  images: number;
  inlineMath: number;
  blockMath: number;
}

function countMatches(source: string, pattern: RegExp): number {
  return (source.match(pattern) ?? []).length;
}

/** 본문을 텍스트·코드·이미지·수식으로 나눈다. 각 요소는 읽는 방식이 달라 따로 센다. */
function splitContent(content: string): ContentParts {
  let text = content.replace(/<!--[\s\S]*?-->/g, "");

  let codeLines = 0;
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code: string) => {
    codeLines += code.split("\n").filter((line) => line.trim()).length;
    return " ";
  });

  const blockMath = countMatches(text, /\$\$[\s\S]+?\$\$/g);
  text = text.replace(/\$\$[\s\S]+?\$\$/g, " ");

  const inlineMath = countMatches(text, /\$[^$\n]+\$/g);
  text = text.replace(/\$[^$\n]+\$/g, " ");

  const images =
    countMatches(text, /!\[[^\]]*\]\([^)]*\)/g) +
    countMatches(text, /<img\b/gi);

  text = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ") // HTML 태그
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크는 텍스트만
    .replace(/`([^`]+)`/g, "$1") // 인라인 코드도 읽는 글자로 센다
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ") // 테이블 구분선
    .replace(/^\s*[-*+]\s+/gm, " ") // 목록 기호
    .replace(/[|#>*~=]+/g, " "); // 마크다운 기호

  return { text, codeLines, images, inlineMath, blockMath };
}

function imageSeconds(count: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.max(IMAGE_FIRST_SECONDS - i, IMAGE_MIN_SECONDS);
  }
  return total;
}

/** 글 본문(마크다운)을 읽는 데 걸리는 예상 시간(분). 최소 1분. */
export function calculateReadingTime(content: string): number {
  const { text, codeLines, images, inlineMath, blockMath } =
    splitContent(content);

  const koreanChars = countMatches(text, HANGUL);
  const words = text
    .replace(HANGUL, " ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

  const seconds =
    (koreanChars / KOREAN_CHARS_PER_MIN) * 60 +
    (words / WORDS_PER_MIN) * 60 +
    codeLines * CODE_SECONDS_PER_LINE +
    imageSeconds(images) +
    inlineMath * MATH_INLINE_SECONDS +
    blockMath * MATH_BLOCK_SECONDS;

  return Math.max(1, Math.round(seconds / 60));
}
