import "../env.js";

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { autoFields } from "../notion/autoFields.js";
import { createChildLogger } from "./logger.js";
import { notion, notionToMarkdown } from "./notion.js";
import { buildAutoFieldData } from "./notionAutoFields.js";
import prisma from "./prisma.js";
import { uploadImageToR2 } from "./r2.js";

const logger = createChildLogger({ module: "notion-sync" });

const BLOG_TITLE = "이름";
const BLOG_SUMMARY = "요약";
const BLOG_THUMBNAIL = "썸네일";
const BLOG_DATE = "작성일";
const BLOG_TAGS = "카테고리";
const BLOG_PROJECTS = "프로젝트";

const PROJECT_TITLE = "이름";
const PROJECT_DESC = "설명";
const PROJECT_THUMBNAIL = "썸네일";
const PROJECT_GITHUB = "Github 주소";
const PROJECT_DEPLOY = "배포 주소";
const PROJECT_START = "시작일";
const PROJECT_END = "종료일";
const PROJECT_STACKS = "기술 스택";

const AWARD_TITLE = "상 이름";
const AWARD_ORG = "주최 / 수여 기관";
const AWARD_DATE = "날짜";
const AWARD_IMAGE = "관련 이미지";
const AWARD_PROJECT = "프로젝트";

const STACK_TITLE = "이름";
const STACK_IMAGE = "이미지";

interface SyncSummary {
  stacks: number;
  projects: number;
  posts: number;
  awards: number;
}

interface ProjectRelationRow {
  projectId: string;
  stackNotionIds: string[];
}

interface PostRelationRow {
  postId: string;
  projectNotionIds: string[];
}

function getUrlDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function slugifyLogPath(text: string): string {
  return text
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function getR2DestinationPath(
  category: string,
  itemName: string,
  label: string,
  variant?: "responsive" | "icon",
): string {
  const ext = variant === "icon" ? "webp|svg" : "webp";

  return `${category}/${slugifyLogPath(itemName)}/${label}.${ext}`;
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured on server`);
  }
  return value;
}

async function queryAll(databaseId: string) {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  while (true) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    pages.push(...(response.results as PageObjectResponse[]));

    if (!response.has_more) {
      break;
    }

    cursor = response.next_cursor ?? undefined;
  }

  return pages;
}

function getTitle(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "title") return "";
  return prop.title.map((item) => item.plain_text).join("").trim();
}

function getRichText(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text.map((item) => item.plain_text).join("").trim();
}

function getDate(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "date" || !prop.date?.start) return null;
  return new Date(prop.date.start);
}

function getUrl(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "url") return null;
  return prop.url ?? null;
}

function getMultiSelect(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select.map((item) => item.name);
}

function getRelationIds(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "relation") return [];
  return prop.relation.map((item) => item.id);
}

function getFileUrl(page: PageObjectResponse, name: string) {
  const prop = page.properties[name];
  if (!prop || prop.type !== "files" || prop.files.length === 0) {
    return null;
  }

  const file = prop.files[0];
  if (file.type === "external") {
    return file.external.url;
  }

  if (file.type === "file") {
    return file.file.url;
  }

  return null;
}

async function getImageUrl(
  page: PageObjectResponse,
  propName: string,
  category: string,
  itemName: string,
  label = "image",
  variant?: "responsive" | "icon",
): Promise<string | null> {
  const rawUrl = getFileUrl(page, propName);
  if (!rawUrl) return null;

  const startedAt = performance.now();
  const destinationPath = getR2DestinationPath(category, itemName, label, variant);

  logger.info(
    {
      category,
      itemName,
      label,
      variant,
      destinationPath,
      sourceDomain: getUrlDomain(rawUrl),
    },
    "Uploading Notion image to R2",
  );

  try {
    const uploadedUrl = await uploadImageToR2(rawUrl, { category, name: itemName, label, variant });

    logger.info(
      {
        category,
        itemName,
        label,
        variant,
        destinationPath,
        durationMs: Math.round(performance.now() - startedAt),
      },
      "Notion image uploaded to R2",
    );

    return uploadedUrl;
  } catch (e) {
    logger.warn(
      {
        err: e,
        category,
        itemName,
        label,
        variant,
        destinationPath,
        sourceDomain: getUrlDomain(rawUrl),
        durationMs: Math.round(performance.now() - startedAt),
      },
      "R2 upload failed; falling back to raw Notion image URL",
    );

    return rawUrl;
  }
}

async function syncStacks(pages: PageObjectResponse[]) {
  const startedAt = performance.now();
  const stackMap = new Map<string, string>();

  logger.info({ count: pages.length }, "Stack sync started");

  for (const page of pages) {
    const notionId = page.id;
    const name = getTitle(page, STACK_TITLE);

    logger.debug({ notionId, name }, "Processing stack item");

    const imageUrl = await getImageUrl(page, STACK_IMAGE, "stacks", name, "icon", "icon");
    const auto = await buildAutoFieldData(page, autoFields.stack, { category: "stacks", name });

    const record = await prisma.stack.upsert({
      where: { notionId },
      create: {
        notionId,
        name,
        imageUrl,
        ...(auto as Record<string, unknown>),
      },
      update: {
        name,
        imageUrl,
        ...(auto as Record<string, unknown>),
      },
    });

    stackMap.set(notionId, record.id);
  }

  logger.info(
    { count: pages.length, durationMs: Math.round(performance.now() - startedAt) },
    "Stack sync completed",
  );

  return stackMap;
}

async function syncProjects(
  pages: PageObjectResponse[],
): Promise<{ projectMap: Map<string, string>; relations: ProjectRelationRow[] }> {
  const startedAt = performance.now();
  const projectMap = new Map<string, string>();
  const relations: ProjectRelationRow[] = [];

  logger.info({ count: pages.length }, "Project sync started");

  for (const page of pages) {
    const notionId = page.id;
    const title = getTitle(page, PROJECT_TITLE);

    logger.debug({ notionId, title }, "Processing project item");

    const description = getRichText(page, PROJECT_DESC);
    const thumbnailUrl = await getImageUrl(page, PROJECT_THUMBNAIL, "projects", title, "thumbnail");
    const githubUrl = getUrl(page, PROJECT_GITHUB);
    const deployUrl = getUrl(page, PROJECT_DEPLOY);
    const startDate = getDate(page, PROJECT_START) ?? new Date();
    const endDate = getDate(page, PROJECT_END);
    const auto = await buildAutoFieldData(page, autoFields.project, { category: "projects", name: title });

    const record = await prisma.project.upsert({
      where: { notionId },
      create: {
        notionId,
        title,
        description,
        thumbnailUrl,
        githubUrl,
        deployUrl,
        startDate,
        endDate,
        ...(auto as Record<string, unknown>),
      },
      update: {
        title,
        description,
        thumbnailUrl,
        githubUrl,
        deployUrl,
        startDate,
        endDate,
        ...(auto as Record<string, unknown>),
      },
    });

    projectMap.set(notionId, record.id);

    relations.push({
      projectId: record.id,
      stackNotionIds: getRelationIds(page, PROJECT_STACKS),
    });
  }

  logger.info(
    { count: pages.length, durationMs: Math.round(performance.now() - startedAt) },
    "Project sync completed",
  );

  return { projectMap, relations };
}

async function syncPosts(
  pages: PageObjectResponse[],
): Promise<{ postMap: Map<string, string>; relations: PostRelationRow[] }> {
  const startedAt = performance.now();
  const postMap = new Map<string, string>();
  const relations: PostRelationRow[] = [];

  logger.info({ count: pages.length }, "Post sync started");

  for (const page of pages) {
    const notionId = page.id;
    const title = getTitle(page, BLOG_TITLE);

    logger.debug({ notionId, title }, "Processing post item");

    const summary = getRichText(page, BLOG_SUMMARY);
    const thumbnailUrl = await getImageUrl(page, BLOG_THUMBNAIL, "posts", title, "thumbnail");
    const date = getDate(page, BLOG_DATE) ?? new Date();
    const categories = getMultiSelect(page, BLOG_TAGS);
    const auto = await buildAutoFieldData(page, autoFields.post, { category: "posts", name: title });

    const markdownBlocks = await notionToMarkdown.pageToMarkdown(notionId);
    const markdownString = notionToMarkdown.toMarkdownString(markdownBlocks);
    const content =
      typeof markdownString === "string"
        ? markdownString
        : markdownString.parent ?? "";

    const record = await prisma.post.upsert({
      where: { notionId },
      create: {
        notionId,
        title,
        summary,
        thumbnailUrl,
        date,
        categories: JSON.stringify(categories),
        content,
        ...(auto as Record<string, unknown>),
      },
      update: {
        title,
        summary,
        thumbnailUrl,
        date,
        categories: JSON.stringify(categories),
        content,
        ...(auto as Record<string, unknown>),
      },
    });

    postMap.set(notionId, record.id);

    relations.push({
      postId: record.id,
      projectNotionIds: getRelationIds(page, BLOG_PROJECTS),
    });
  }

  logger.info(
    { count: pages.length, durationMs: Math.round(performance.now() - startedAt) },
    "Post sync completed",
  );

  return { postMap, relations };
}

async function syncAwards(
  pages: PageObjectResponse[],
  projectMap: Map<string, string>,
) {
  const startedAt = performance.now();

  logger.info({ count: pages.length }, "Award sync started");

  for (const page of pages) {
    const notionId = page.id;
    const title = getTitle(page, AWARD_TITLE);

    logger.debug({ notionId, title }, "Processing award item");

    const organization = getRichText(page, AWARD_ORG);
    const date = getDate(page, AWARD_DATE) ?? new Date();
    const imageUrl = await getImageUrl(page, AWARD_IMAGE, "awards", title, "image");
    const projectNotionId = getRelationIds(page, AWARD_PROJECT)[0];
    const projectId = projectNotionId
      ? projectMap.get(projectNotionId) ?? null
      : null;
    const auto = await buildAutoFieldData(page, autoFields.award, { category: "awards", name: title });

    await prisma.award.upsert({
      where: { notionId },
      create: {
        notionId,
        title,
        organization,
        date,
        imageUrl,
        projectId,
        ...(auto as Record<string, unknown>),
      },
      update: {
        title,
        organization,
        date,
        imageUrl,
        projectId,
        ...(auto as Record<string, unknown>),
      },
    });
  }

  logger.info(
    { count: pages.length, durationMs: Math.round(performance.now() - startedAt) },
    "Award sync completed",
  );
}

async function syncProjectStacks(
  relations: ProjectRelationRow[],
  stackMap: Map<string, string>,
) {
  for (const relation of relations) {
    const stackIds = relation.stackNotionIds
      .map((notionId) => stackMap.get(notionId))
      .filter((id): id is string => Boolean(id));

    await prisma.projectStack.deleteMany({
      where: { projectId: relation.projectId },
    });

    if (stackIds.length === 0) {
      continue;
    }

    await prisma.projectStack.createMany({
      data: stackIds.map((stackId) => ({
        projectId: relation.projectId,
        stackId,
      })),
    });
  }
}

async function syncPostProjects(
  relations: PostRelationRow[],
  projectMap: Map<string, string>,
) {
  for (const relation of relations) {
    const projectIds = relation.projectNotionIds
      .map((notionId) => projectMap.get(notionId))
      .filter((id): id is string => Boolean(id));

    await prisma.postProject.deleteMany({
      where: { postId: relation.postId },
    });

    if (projectIds.length === 0) {
      continue;
    }

    await prisma.postProject.createMany({
      data: projectIds.map((projectId) => ({
        postId: relation.postId,
        projectId,
      })),
    });
  }
}

export async function syncNotionData(): Promise<SyncSummary> {
  const startedAt = performance.now();

  logger.info("Notion data sync started");

  requireEnv(process.env.NOTION_TOKEN, "NOTION_TOKEN");
  const blogDbId = requireEnv(
    process.env.NOTION_BLOG_DB_ID,
    "NOTION_BLOG_DB_ID",
  );
  const projectDbId = requireEnv(
    process.env.NOTION_PROJECT_DB_ID,
    "NOTION_PROJECT_DB_ID",
  );
  const awardDbId = requireEnv(
    process.env.NOTION_AWARD_DB_ID,
    "NOTION_AWARD_DB_ID",
  );
  const stackDbId = requireEnv(
    process.env.NOTION_STACK_DB_ID,
    "NOTION_STACK_DB_ID",
  );

  const [stackPages, projectPages, postPages, awardPages] = await Promise.all([
    queryAll(stackDbId),
    queryAll(projectDbId),
    queryAll(blogDbId),
    queryAll(awardDbId),
  ]);

  logger.info(
    {
      stacks: stackPages.length,
      projects: projectPages.length,
      posts: postPages.length,
      awards: awardPages.length,
    },
    "Notion pages loaded",
  );

  logger.info({ count: stackPages.length }, "Starting stack sync phase");

  const stackMap = await syncStacks(stackPages);

  logger.info({ count: projectPages.length }, "Starting project sync phase");

  const { projectMap, relations: projectRelations } =
    await syncProjects(projectPages);

  logger.info({ count: postPages.length }, "Starting post sync phase");

  const { relations: postRelations } = await syncPosts(postPages);

  await syncProjectStacks(projectRelations, stackMap);
  await syncPostProjects(postRelations, projectMap);

  logger.info({ count: awardPages.length }, "Starting award sync phase");

  await syncAwards(awardPages, projectMap);

  const summary = {
    stacks: stackPages.length,
    projects: projectPages.length,
    posts: postPages.length,
    awards: awardPages.length,
  };

  logger.info(
    { ...summary, durationMs: Math.round(performance.now() - startedAt) },
    "Notion data sync completed",
  );

  return summary;
}
