import { useQuery } from "@tanstack/react-query";
import { GET, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

export interface DataVolume {
  id: string;
  name?: string;
  knowledge?: string | number;
  knowledge_title?: string;
  size?: number;
  chunk_count?: number;
  created?: string;
  modified?: string;
}

export function useDataVolumes() {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: ["data-volumes", branchId],
    queryFn: () =>
      GET<DataVolume[] | { count: number; results: DataVolume[] }>(ENDPOINTS.dataVolumes.list, {
        params: branchId ? { branch: branchId } : undefined,
      }).then((data) => normalizeListResponse<DataVolume>(data)),
  });
}
