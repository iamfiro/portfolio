import { StacksResponse } from "@/feature/stacks/schema";
import { get } from "@/shared/lib/api";

export function getStacks(): Promise<StacksResponse> {
  return get<StacksResponse>("/stacks");
}
