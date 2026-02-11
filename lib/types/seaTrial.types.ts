/**
 * Sea Trial Types
 * TypeScript definitions for sea trial data structures
 */

export enum TrialStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface SeaTrial {
  sea_trial_id: number;
  trial_name: string;
  vessel_id?: number;
  vessel_name: string;
  trial_date: string;
  status: TrialStatus;

  // Environmental conditions
  wind_speed?: number;
  wind_direction?: number;
  wave_height?: number;
  wave_period?: number;
  current_speed?: number;
  current_direction?: number;
  water_temperature?: number;
  air_temperature?: number;
  water_depth?: number;

  // Vessel condition
  displacement?: number;
  draft_fore?: number;
  draft_aft?: number;
  trim?: number;

  // Predicted performance
  predicted_speed?: number;
  predicted_power?: number;
  predicted_fuel_consumption?: number;
  predicted_rpm?: number;

  // Actual performance
  actual_speed?: number;
  actual_power?: number;
  actual_fuel_consumption?: number;
  actual_rpm?: number;

  // Performance analysis
  speed_deviation?: number;
  power_deviation?: number;
  fuel_deviation?: number;
  overall_performance_score?: number;

  // Contract specifications
  contract_speed?: number;
  contract_power?: number;
  contract_fuel?: number;
  meets_contract?: boolean;

  // Additional data
  notes?: string;
  test_location?: string;
  duration_hours?: number;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface SeaTrialCreate {
  trial_name: string;
  vessel_id?: number;
  vessel_name: string;
  trial_date: string;
  status?: TrialStatus;

  // Environmental conditions
  wind_speed?: number;
  wind_direction?: number;
  wave_height?: number;
  wave_period?: number;
  current_speed?: number;
  current_direction?: number;
  water_temperature?: number;
  air_temperature?: number;
  water_depth?: number;

  // Vessel condition
  displacement?: number;
  draft_fore?: number;
  draft_aft?: number;
  trim?: number;

  // Predicted performance
  predicted_speed?: number;
  predicted_power?: number;
  predicted_fuel_consumption?: number;
  predicted_rpm?: number;

  // Actual performance
  actual_speed?: number;
  actual_power?: number;
  actual_fuel_consumption?: number;
  actual_rpm?: number;

  // Contract specifications
  contract_speed?: number;
  contract_power?: number;
  contract_fuel?: number;

  // Additional data
  notes?: string;
  test_location?: string;
  duration_hours?: number;
}

export interface SeaTrialUpdate {
  trial_name?: string;
  vessel_name?: string;
  trial_date?: string;
  status?: TrialStatus;

  // Environmental conditions
  wind_speed?: number;
  wind_direction?: number;
  wave_height?: number;
  wave_period?: number;
  current_speed?: number;
  current_direction?: number;
  water_temperature?: number;
  air_temperature?: number;
  water_depth?: number;

  // Vessel condition
  displacement?: number;
  draft_fore?: number;
  draft_aft?: number;
  trim?: number;

  // Predicted performance
  predicted_speed?: number;
  predicted_power?: number;
  predicted_fuel_consumption?: number;
  predicted_rpm?: number;

  // Actual performance
  actual_speed?: number;
  actual_power?: number;
  actual_fuel_consumption?: number;
  actual_rpm?: number;

  // Contract specifications
  contract_speed?: number;
  contract_power?: number;
  contract_fuel?: number;

  // Additional data
  notes?: string;
  test_location?: string;
  duration_hours?: number;
}

export interface PerformanceComparison {
  metric: string;
  predicted?: number;
  actual?: number;
  deviation?: number;
  deviation_absolute?: number;
  unit: string;
  status:
    | "better"
    | "worse"
    | "within_tolerance"
    | "acceptable"
    | "needs_attention"
    | "unknown";
}

export interface SeaTrialAnalysis {
  sea_trial_id: number;
  trial_name: string;
  vessel_name: string;
  trial_date: string;
  status: TrialStatus;

  speed_comparison: PerformanceComparison;
  power_comparison: PerformanceComparison;
  fuel_comparison: PerformanceComparison;
  rpm_comparison: PerformanceComparison;

  overall_performance_score: number;
  meets_contract: boolean;
  summary: string;
  recommendations: string[];
}

export interface SeaTrialSummary {
  total_trials: number;
  completed_trials: number;
  avg_performance_score?: number;
  trials_meeting_contract: number;
  avg_speed_deviation?: number;
  avg_power_deviation?: number;
  avg_fuel_deviation?: number;
}

export interface SeaTrialFilters {
  skip?: number;
  limit?: number;
  status?: TrialStatus;
  vessel_name?: string;
}
