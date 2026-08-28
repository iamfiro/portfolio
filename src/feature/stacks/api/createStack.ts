import { StackMutationPayload, StackResponse } from "@/feature/stacks/schema";
import { post } from "@/shared/lib/api";

export function createStack(payload: StackMutationPayload): Promise<StackResponse> {
  return post<StackResponse>("/stacks", payload);
}
