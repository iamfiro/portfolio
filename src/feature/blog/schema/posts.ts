import { ApiResponse } from "@/shared/types/api";

export interface RelatedProject {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  techStack: string[];
  githubUrl: string | null;
  deployUrl: string | null;
  startDate: string;
  endDate: string | null;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  tags: string[];
  content?: string;
  relatedProjects?: RelatedProject[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PostMutationPayload {
  title: string;
  summary?: string | null;
  thumbnailUrl?: string | null;
  date: string;
  categories: string[];
  content?: string | null;
  projectIds?: string[];
}

export type Posts = Post[];
export type PostsResponse = ApiResponse<Posts>;
export type PostResponse = ApiResponse<Post>;
