import { ApiResponse } from "@/shared/types/api";

export interface StackProject {
  id: string;
  title: string;
}

export interface TechStack {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  category: string | null;
  projects: StackProject[];
  createdAt: string;
  updatedAt: string;
}

export interface StackMutationPayload {
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  category?: string | null;
}

export type StacksResponse = ApiResponse<TechStack[]>;
export type StackResponse = ApiResponse<TechStack>;
