import { StackMutationPayload, StackResponse } from "@/feature/stacks/schema";
import { put } from "@/shared/lib/api";

interface UpdateStackPayload {
  id: string;
  payload: Partial<StackMutationPayload>;
}

export function updateStack({ id, payload }: UpdateStackPayload): Promise<StackResponse> {
  return put<StackResponse>(`/stacks/${id}`, payload);
}
