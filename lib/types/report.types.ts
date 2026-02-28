export interface ReportItem {
  id: number;
  title: string;
  report_type: "prediction_summary" | "sea_trial_summary";
  created_at: string;
  user_email?: string;
}

export interface ReportListResponse {
  reports: ReportItem[];
  total: number;
}

export interface GenerateReportRequest {
  report_type: "prediction_summary" | "sea_trial_summary";
  title?: string;
}
