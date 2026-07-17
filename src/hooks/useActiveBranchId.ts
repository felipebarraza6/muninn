import { useEffect, useState } from "react";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";

/** Branch activa para incluir en queryKeys de Studio (refetch al cambiar). */
export function useActiveBranchId(): string | null {
  const [branchId, setBranchId] = useState<string | null>(() => getActiveBranchId());
  useEffect(() => onBranchChange((id) => setBranchId(id)), []);
  return branchId;
}
