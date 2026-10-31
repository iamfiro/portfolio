import type { Award } from "@/feature/awards/schema";
import type { Post } from "@/feature/blog/schema";
import type { Activity } from "@/feature/home/components/activity/activity.type";
import type { Project } from "@/feature/projects/schema";
import { ApiResponse } from "@/shared/types/api";

export interface Resume {
  projects: Project[];
  awards: Award[];
  activities: Activity[];
  posts: Post[];
}

export type ResumeResponse = ApiResponse<Resume>;
