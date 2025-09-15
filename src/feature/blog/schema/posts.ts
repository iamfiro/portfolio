import { ApiResponse } from "@/shared/types/api";

export interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: Date;
  tags: string[];
  content?: string;
}

export type Posts = Post[];
export type PostsResponse = ApiResponse<Posts>;
export type PostResponse = ApiResponse<Post>;
