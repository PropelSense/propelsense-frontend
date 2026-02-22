/**
 * TypeScript types for ML Power Prediction
 */

export interface VesselFeatures {
  /** Aft draft in meters */
  draft_aft_telegram: number;
  /** Forward draft in meters */
  draft_fore_telegram: number;
  /** Speed through water in knots */
  stw: number;
  /** Speed difference (SOG - STW) */
  diff_speed_overground: number;
  /** Apparent wind V component (m/s) */
  awind_vcomp_provider: number;
  /** Apparent wind U component (m/s) */
  awind_ucomp_provider: number;
  /** Current V component (m/s) */
  rcurrent_vcomp: number;
  /** Current U component (m/s) */
  rcurrent_ucomp: number;
  /** Combined wind and swell wave height in meters */
  comb_wind_swell_wave_height: number;
  /** Days since last dry dock */
  timeSinceDryDock: number;
}

export interface PowerPredictionRequest {
  features: VesselFeatures;
  save_to_history?: boolean;
}

export interface ModelPerformance {
  mae_dev_in?: number;
  mae_dev_out?: number;
  r2_dev_in?: number;
  r2_dev_out?: number;
}

export interface PredictionMetadata {
  model_used: string;
  n_features?: number;
  unit?: string;
  model_performance?: ModelPerformance;
}

export interface PowerPredictionResponse {
  id: number | null;
  predicted_power_kw: number;
  predicted_power_mw: number;
  model_used: string;
  metadata: PredictionMetadata;
  created_at: string | null;
}

export interface PredictionHistoryItem {
  id: number;
  user_id: string;
  user_email: string | null;
  draft_aft_telegram: number | null;
  draft_fore_telegram: number | null;
  stw: number | null;
  diff_speed_overground: number | null;
  awind_vcomp_provider: number | null;
  awind_ucomp_provider: number | null;
  rcurrent_vcomp: number | null;
  rcurrent_ucomp: number | null;
  comb_wind_swell_wave_height: number | null;
  timeSinceDryDock: number | null;
  predicted_power_kw: number;
  predicted_power_mw: number;
  model_used: string;
  model_metadata: PredictionMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface PredictionHistoryListResponse {
  total: number;
  predictions: PredictionHistoryItem[];
  page: number;
  page_size: number;
}

export interface PredictionStatsResponse {
  total_predictions: number;
  avg_power_kw: number;
  max_power_kw: number;
  min_power_kw: number;
  most_recent: string | null;
  predictions_this_month: number;
}
