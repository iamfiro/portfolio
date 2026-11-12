import fs from "node:fs";
import path from "node:path";

import type { Plugin, ResolvedConfig } from "vite";

import {
  asString,
  parseFrontmatter,
} from "../src/shared/utils/frontmatter.util";

const SITE_URL = "https://devfiro.com";
const POSTS_DIR = "src/content/posts";

interface PageMeta {
  title: string;
  description: string;
  url: string;
  image: string | null;
  imageAlt: string;
  type: "website" | "article";
  publishedTime?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function absoluteUrl(value: string): string {
  return value.startsWith("http") ? value : `${SITE_URL}${value}`;
}

/** index.html 의 기본 메타를 페이지별 값으로 바꾼다. */
function applyMeta(html: string, meta: PageMeta): string {
  const setMeta = (key: string, value: string, source: string) => {
    const attr = key.startsWith("og:") ? "property" : "name";
    return source.replace(
      new RegExp(`(<meta ${attr}="${key}"\\s+content=")[^"]*(")`),
      (_, head: string, tail: string) => `${head}${escapeHtml(value)}${tail}`,
    );
  };

  let result = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`,
  );

  result = setMeta("description", meta.description, result);
  result = setMeta("og:type", meta.type, result);
  result = setMeta("og:title", meta.title, result);
  result = setMeta("og:description", meta.description, result);
  result = setMeta("og:url", meta.url, result);
  result = setMeta("twitter:title", meta.title, result);
  result = setMeta("twitter:description", meta.description, result);

  // 썸네일이 있으면 교체하고, 크기를 모르므로 기본 이미지의 width/height 는 지운다
  if (meta.image) {
    result = setMeta("og:image", meta.image, result);
    result = setMeta("og:image:alt", meta.imageAlt, result);
    result = setMeta("twitter:image", meta.image, result);
    result = result.replace(
      /\s*<meta property="og:image:(?:width|height)"[^>]*>/g,
      "",
    );
  }

  const extra = [
    `<link rel="canonical" href="${escapeHtml(meta.url)}" />`,
    meta.publishedTime &&
      `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return result.replace("</head>", `  ${extra}\n  </head>`);
}

function writePage(outDir: string, route: string, html: string) {
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

/**
 * 빌드 후 `/blog`, `/blog/:id` 경로에 OG 메타가 채워진 index.html 을 만든다.
 * SPA 라 크롤러는 JS 를 실행하지 않으므로, 정적 HTML 에 메타가 있어야 링크 미리보기가 뜬다.
 */
export default function blogOgPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "blog-og",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const postsDir = path.resolve(config.root, POSTS_DIR);

      writePage(
        outDir,
        "blog",
        applyMeta(template, {
          title: "블로그 - 조성주",
          description: "개발하며 겪은 문제와 해결 과정을 기록합니다.",
          url: `${SITE_URL}/blog`,
          image: null,
          imageAlt: "",
          type: "website",
        }),
      );

      const files = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith(".md"));

      for (const file of files) {
        const id = file.replace(/\.md$/, "");
        const { fields } = parseFrontmatter(
          fs.readFileSync(path.join(postsDir, file), "utf8"),
        );
        const title = asString(fields.title) || id;
        const thumbnail = asString(fields.thumbnail);
        const date = asString(fields.date);

        writePage(
          outDir,
          `blog/${id}`,
          applyMeta(template, {
            title,
            description: asString(fields.description),
            url: `${SITE_URL}/blog/${id}`,
            image: thumbnail ? absoluteUrl(thumbnail) : null,
            imageAlt: title,
            type: "article",
            publishedTime: date || undefined,
          }),
        );
      }

      config.logger.info(
        `[blog-og] /blog 와 글 ${files.length}개의 OG 페이지를 생성했습니다`,
      );
    },
  };
}
