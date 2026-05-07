import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  async getDashboard(userId: string, period: "today" | "week" | "month") {
    return dashboardRepository.getDashboard(userId, period);
  },
};
