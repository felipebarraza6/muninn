import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";

export function useClinicDashboard() {
  return useQuery({
    queryKey: ["analytics", "clinic-dashboard"],
    queryFn: () => GET(ENDPOINTS.analytics.clinicDashboard),
    staleTime: 60_000,
  });
}

export function useCompleteDashboard() {
  return useQuery({
    queryKey: ["analytics", "complete-dashboard"],
    queryFn: () => GET(ENDPOINTS.analytics.dashboard),
    staleTime: 60_000,
  });
}
