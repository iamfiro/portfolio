import { ApiResponse } from "@/shared/types/api";

export interface RelatedPost {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  date?: string;
  tags?: string[];
}

export interface RelatedAward {
  id: string;
  title: string;
  description: string | null;
  organization: string;
  date: string;
  imageUrl: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  techStack: string[];
  logoUrl: string | null;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: string;
  endDate: string | null;
  relatedPosts?: RelatedPost[];
  awards?: RelatedAward[];
}

export type Projects = Project[];
export type ProjectsResponse = ApiResponse<Projects>;
export type ProjectResponse = ApiResponse<Project>;
