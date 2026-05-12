import { ApiResponse } from "@/shared/types/api";

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  imageUrl: string | null;
  projectId: string | null;
  project: {
    id: string;
    title: string;
  } | null;
}

export interface AwardMutationPayload {
  title: string;
  organization: string;
  date: string;
  imageUrl?: string | null;
  projectId?: string | null;
}

export type Awards = Award[];
export type AwardsResponse = ApiResponse<Awards>;
export type AwardResponse = ApiResponse<Award>;
