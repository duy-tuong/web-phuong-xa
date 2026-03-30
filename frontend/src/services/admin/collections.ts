import type { LegacyCollectionResponse } from "@/services/admin/types";

export function unwrapLegacyCollection<T>(payload: T[] | LegacyCollectionResponse<T> | null | undefined): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.value)) {
    return payload.value;
  }

  return [];
}
