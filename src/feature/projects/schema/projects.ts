import { ApiResponse } from "@/shared/types/api";

import type { CaseStudy } from "./case-study";

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
  logoUrl: string | null;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: string;
  endDate: string | null;
  resume: boolean;
  relatedPosts?: RelatedPost[];
  award?: {
    id: string;
    title: string;
  } | null;
  caseStudy?: CaseStudy | null;
}

export type Projects = Project[];
export type ProjectsResponse = ApiResponse<Projects>;
export type ProjectResponse = ApiResponse<Project>;
