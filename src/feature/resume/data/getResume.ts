import type { ResumeResponse } from "@/feature/resume/schema";
import {
  contentActivities,
  contentAwards,
  contentPosts,
  contentProjects,
} from "@/shared/content/content";

function byDateDesc(first: string | Date, second: string | Date): number {
  return new Date(second).getTime() - new Date(first).getTime();
}

/** frontmatter에 `resume: true`가 지정된 항목만 이력서에 노출합니다. */
export function getResume(): Promise<ResumeResponse> {
  const projects = contentProjects
    .filter((project) => project.resume)
    .sort((first, second) => byDateDesc(first.startDate, second.startDate));

  const awards = contentAwards
    .filter((award) => award.resume)
    .sort((first, second) => byDateDesc(first.date, second.date));

  const activities = contentActivities.filter((activity) => activity.resume);

  const posts = contentPosts
    .filter((post) => post.resume)
    .sort((first, second) => byDateDesc(first.date, second.date));

  return Promise.resolve({
    ok: true,
    data: { projects, awards, activities, posts },
  });
}
