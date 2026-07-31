import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SITE_URL = "https://devfiro.com";
const API_URL = (process.env.SEO_API_URL || process.env.VITE_API_URL || "").replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const staticPages = [
  { path: "/", title: "Sungju Cho - Creative Developer", description: "즐거운 디지털 경험을 만드는 Creative Developer Sungju Cho의 포트폴리오입니다.", type: "website" },
  { path: "/projects", title: "Projects | Sungju Cho", description: "Sungju Cho가 설계하고 개발한 주요 프로젝트를 소개합니다.", type: "CollectionPage" },
  { path: "/awards", title: "Awards | Sungju Cho", description: "프로젝트와 개발 활동을 통해 받은 수상 기록입니다.", type: "CollectionPage" },
  { path: "/blog", title: "Blog | Sungju Cho", description: "개발 과정에서 배운 내용과 경험을 기록한 기술 블로그입니다.", type: "Blog" },
  { path: "/contact", title: "Contact | Sungju Cho", description: "프로젝트와 협업에 관해 Sungju Cho에게 연락할 수 있습니다.", type: "ContactPage" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const expression = new RegExp(`(<meta\\s+${selector}=["'][^"']+["']\\s+content=["'])[^"']*(["']\\s*\\/?>)`, "i");
  return html.replace(expression, `$1${escaped}$2`);
}

function renderShell(page) {
  return `<main style="min-height:100vh;padding:48px 20px;background:#141414;color:#fff;font-family:system-ui,sans-serif"><div style="max-width:700px;margin:0 auto"><p style="color:#ff5e00">Sungju Cho</p><h1>${escapeHtml(page.heading || page.title)}</h1><p>${escapeHtml(page.description)}</p><a href="/" style="color:#ff5e00">홈으로 이동</a></div></main>`;
}

function renderJsonLd(page) {
  const data = page.jsonLd || {
    "@context": "https://schema.org",
    "@type": page.type,
    name: page.heading || page.title,
    description: page.description,
    url: `${SITE_URL}${page.path}`,
  };
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

function createPageHtml(template, page) {
  const canonical = `${SITE_URL}${page.path}`;
  const image = page.image || DEFAULT_IMAGE;
  let html = template.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceMeta(html, 'name="description"', page.description);
  html = replaceMeta(html, 'property="og:title"', page.title);
  html = replaceMeta(html, 'property="og:description"', page.description);
  html = replaceMeta(html, 'property="og:url"', canonical);
  html = replaceMeta(html, 'property="og:image"', image);
  html = replaceMeta(html, 'name="twitter:title"', page.title);
  html = replaceMeta(html, 'name="twitter:description"', page.description);
  html = replaceMeta(html, 'name="twitter:image"', image);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = html.replace('<div id="root"></div>', `<div id="root">${renderShell(page)}</div>`);
  return html.replace("</head>", `<script type="application/ld+json">${renderJsonLd(page)}</script>\n  </head>`);
}

async function writeRoute(template, page) {
  const routeDirectory = page.path === "/"
    ? DIST_DIR
    : path.join(DIST_DIR, ...page.path.split("/").filter(Boolean));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), createPageHtml(template, page), "utf8");
}

async function fetchCollection(endpoint) {
  if (!API_URL) return [];
  try {
    const response = await fetch(`${API_URL}${endpoint}`, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.warn(`[seo] ${endpoint} 조회를 건너뜁니다:`, error instanceof Error ? error.message : error);
    return [];
  }
}

async function main() {
  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const projects = await fetchCollection("/projects");
  const posts = await fetchCollection("/blog/posts");

  const projectPages = projects
    .filter((project) => project && typeof project.id === "string" && typeof project.title === "string")
    .map((project) => ({
      path: `/projects/${encodeURIComponent(project.id)}`,
      title: `${project.title} | Sungju Cho`,
      heading: project.title,
      description: project.description || `${project.title} 프로젝트를 소개합니다.`,
      image: project.thumbnailUrl || DEFAULT_IMAGE,
      type: "CreativeWork",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description || "",
        url: `${SITE_URL}/projects/${encodeURIComponent(project.id)}`,
        image: project.thumbnailUrl || DEFAULT_IMAGE,
        creator: { "@type": "Person", name: "Sungju Cho", url: SITE_URL },
      },
    }));

  const postPages = posts
    .filter((post) => post && typeof post.title === "string")
    .map((post) => ({
      path: `/blog/${encodeURIComponent(post.title)}`,
      title: `${post.title} | Sungju Cho`,
      heading: post.title,
      description: post.description || `${post.title} 아티클입니다.`,
      image: post.thumbnail || DEFAULT_IMAGE,
      type: "Article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description || "",
        datePublished: post.date,
        url: `${SITE_URL}/blog/${encodeURIComponent(post.title)}`,
        image: post.thumbnail || DEFAULT_IMAGE,
        author: { "@type": "Person", name: "Sungju Cho", url: SITE_URL },
      },
    }));

  const pages = [...staticPages, ...projectPages, ...postPages];
  await Promise.all(pages.map((page) => writeRoute(template, page)));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${escapeXml(`${SITE_URL}${page.path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf8");

  console.log(`[seo] ${pages.length}개 라우트의 정적 SEO 문서를 생성했습니다.`);
}

await main();
