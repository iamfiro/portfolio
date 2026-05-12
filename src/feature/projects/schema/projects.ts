import { ApiResponse } from "@/shared/types/api";

export interface RelatedPost {
  title: string; // = slug, used for routing
  description?: string;
  thumbnail?: string;
  date?: string;
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: string;
  endDate: string | null;
  relatedPosts?: RelatedPost[];
}

export type Projects = Project[];
export type ProjectsResponse = ApiResponse<Projects>;
export type ProjectResponse = ApiResponse<Project>;
