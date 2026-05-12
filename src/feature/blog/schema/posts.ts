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
  date: Date;
  tags: string[];
  content?: string;
  relatedProjects?: RelatedProject[];
}

export type Posts = Post[];
export type PostsResponse = ApiResponse<Posts>;
export type PostResponse = ApiResponse<Post>;
