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
  tags: string[];
  logoUrl: string | null;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: string;
  endDate: string | null;
  resume: boolean;
  /** 프로젝트 마크다운 파일의 본문. 비어 있으면 빈 문자열 */
  content: string;
  relatedPosts?: RelatedPost[];
  award?: {
    id: string;
    title: string;
  } | null;
}

export type Projects = Project[];
export type ProjectsResponse = ApiResponse<Projects>;
export type ProjectResponse = ApiResponse<Project>;
