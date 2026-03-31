export type TDashboardSummary = {
  total: number;
  completed: number;
  pending: number;
  canceled: number;
  totalTrendLabel?: string;
  totalTrendValue?: string;
  completedTrendLabel?: string;
  completedTrendValue?: string;
  pendingTrendLabel?: string;
  pendingTrendValue?: string;
  canceledTrendLabel?: string;
  canceledTrendValue?: string;
  monthlyGoal?: number;
};

export type TDashboardMonthlyPoint = {
  month: string;
  label: string;
  created: number;
  completed: number;
  pending: number;
};

export type TDashboardStatusDistribution = {
  total: number;
  completed: number;
  pending: number;
  canceled: number;
};

export type TDashboardRankingItem = {
  username: string;
  count: number;
};

export type TDashboardRecentActivityItem = {
  id: string | number;
  type: "created" | "updated" | "completed" | "pending" | "canceled" | "deleted";
  username: string;
  appointment_name: string;
  description?: string;
  created_at: string;
};

export type TDashboardDataFlags = {
  summary: boolean;
  monthly: boolean;
  statusDistribution: boolean;
  ranking: boolean;
  recentActivity: boolean;
};

export type TDashboardResponse = {
  summary: TDashboardSummary;
  monthly_trend: TDashboardMonthlyPoint[];
  status_distribution: TDashboardStatusDistribution;
  ranking_by_user: TDashboardRankingItem[];
  recent_activity: TDashboardRecentActivityItem[];
  data_flags?: Partial<TDashboardDataFlags>;
};
