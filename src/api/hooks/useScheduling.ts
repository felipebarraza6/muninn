import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export interface SchedulingDashboardSummary {
  total_calendars: number;
  total_bookings_today: number;
  upcoming_bookings: number;
  total_tasks: number;
  overdue_tasks: number;
  total_meetings: number;
  upcoming_meetings: number;
  bookings_by_status: Record<string, number>;
}

export function useSchedulingDashboard() {
  return useQuery<SchedulingDashboardSummary>({
    queryKey: ["scheduling", "dashboard", "summary"],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.scheduling.dashboardSummary);
      return data;
    },
  });
}
