import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

export function useClinicDashboard() {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: ["analytics", "clinic-dashboard", branchId],
    queryFn: () => GET(ENDPOINTS.analytics.clinicDashboard),
    staleTime: 60_000,
  });
}

export function useCompleteDashboard() {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: ["analytics", "complete-dashboard", branchId],
    queryFn: () => GET(ENDPOINTS.analytics.dashboard),
    staleTime: 60_000,
  });
}
