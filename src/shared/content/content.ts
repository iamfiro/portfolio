import type { Award } from "@/feature/awards/schema";
import type { Post, RelatedProject } from "@/feature/blog/schema";
import type { Project, RelatedPost } from "@/feature/projects/schema";
import {
  asArray,
  asNullableString,
  asString,
} from "@/shared/utils/frontmatter.util";

import { rawAwards } from "./raw/awards.raw";
import { rawPosts } from "./raw/posts.raw";
import { rawProjects } from "./raw/projects.raw";

const baseProjects: Project[] = rawProjects.map((entry) => ({
  id: entry.id,
  title: asString(entry.fields.title),
  description: asString(entry.fields.description),
  techStack: asArray(entry.fields.techStack),
  logoUrl: asNullableString(entry.fields.logoUrl),
  thumbnailUrl: asNullableString(entry.fields.thumbnailUrl),
  githubUrl: asNullableString(entry.fields.githubUrl),
  deployUrl: asNullableString(entry.fields.deployUrl),
  startDate: asString(entry.fields.startDate),
  endDate: asNullableString(entry.fields.endDate),
}));

const projectById = new Map(
  baseProjects.map((project) => [project.id, project]),
);

const posts: Post[] = rawPosts.map((entry) => {
  const relatedProjects: RelatedProject[] = asArray(
    entry.fields.relatedProjects,
  )
    .map((slug) => projectById.get(slug))
    .filter((project): project is Project => Boolean(project))
    .map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      deployUrl: project.deployUrl,
      startDate: project.startDate,
      endDate: project.endDate,
    }));

  return {
    id: entry.id,
    title: asString(entry.fields.title),
    description: asString(entry.fields.description),
    thumbnail: asString(entry.fields.thumbnail),
    date: new Date(asString(entry.fields.date)),
    tags: asArray(entry.fields.tags),
    content: entry.content,
    relatedProjects,
  };
});

const awards: Award[] = rawAwards.map((entry) => {
  const projectId = asNullableString(entry.fields.projectId);
  const project = projectId ? (projectById.get(projectId) ?? null) : null;

  return {
    id: entry.id,
    title: asString(entry.fields.title),
    organization: asString(entry.fields.organization),
    date: asString(entry.fields.date),
    imageUrl: asNullableString(entry.fields.imageUrl),
    projectId,
    project: project ? { id: project.id, title: project.title } : null,
  };
});

// projectId -> 해당 프로젝트를 대표하는 첫 번째 award
const awardByProjectId = new Map<string, Award>();
for (const award of awards) {
  if (award.projectId && !awardByProjectId.has(award.projectId)) {
    awardByProjectId.set(award.projectId, award);
  }
}

// projectId -> 해당 프로젝트를 relatedProjects에 포함한 post 목록 (역참조)
const relatedPostsByProjectId = new Map<string, RelatedPost[]>();
for (const post of posts) {
  for (const project of post.relatedProjects ?? []) {
    const list = relatedPostsByProjectId.get(project.id) ?? [];
    list.push({
      title: post.id, // RelatedPost.title은 라우팅용 슬러그로 사용됨
      description: post.description,
      thumbnail: post.thumbnail,
      date: post.date.toISOString(),
      tags: post.tags,
    });
    relatedPostsByProjectId.set(project.id, list);
  }
}

const projects: Project[] = baseProjects.map((project) => {
  const award = awardByProjectId.get(project.id);
  return {
    ...project,
    relatedPosts: relatedPostsByProjectId.get(project.id) ?? [],
    award: award ? { id: award.id, title: award.title } : null,
  };
});

export const contentProjects = projects;
export const contentPosts = posts;
export const contentAwards = awards;
