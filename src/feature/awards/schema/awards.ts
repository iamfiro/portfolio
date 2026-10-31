import { ApiResponse } from "@/shared/types/api";

export interface Award {
  id: string;
  title: string;
  organization: string;
  logoUrl: string | null;
  date: string;
  imageUrl: string | null;
  resume: boolean;
  projectId: string | null;
  project: {
    id: string;
    title: string;
  } | null;
}

export type Awards = Award[];
export type AwardsResponse = ApiResponse<Awards>;
export type AwardResponse = ApiResponse<Award>;
