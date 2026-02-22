/**
 * Sea Trial Service
 * API client for sea trial management and analysis
 */
import { API_BASE_URL } from "@/lib/constants/app";
import type {
  SeaTrial,
  SeaTrialCreate,
  SeaTrialUpdate,
  SeaTrialAnalysis,
  SeaTrialSummary,
  SeaTrialFilters,
  MLPredictionResult,
} from "@/lib/types/seaTrial.types";

const BASE_URL = API_BASE_URL || "http://localhost:8000";
const ENDPOINT = `${BASE_URL}/api/v1/sea-trials`;

/**
 * Fetch all sea trials with optional filters
 */
export async function getSeaTrials(
  filters?: SeaTrialFilters,
): Promise<SeaTrial[]> {
  const params = new URLSearchParams();

  if (filters?.skip !== undefined)
    params.append("skip", filters.skip.toString());
  if (filters?.limit !== undefined)
    params.append("limit", filters.limit.toString());
  if (filters?.status) params.append("status", filters.status);
  if (filters?.vessel_name) params.append("vessel_name", filters.vessel_name);

  const url = `${ENDPOINT}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sea trials: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single sea trial by ID
 */
export async function getSeaTrial(trialId: number): Promise<SeaTrial> {
  const response = await fetch(`${ENDPOINT}/${trialId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sea trial ${trialId}: ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Create a new sea trial
 */
export async function createSeaTrial(data: SeaTrialCreate): Promise<SeaTrial> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create sea trial: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing sea trial
 */
export async function updateSeaTrial(
  trialId: number,
  data: SeaTrialUpdate,
): Promise<SeaTrial> {
  const response = await fetch(`${ENDPOINT}/${trialId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update sea trial ${trialId}: ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Delete a sea trial
 */
export async function deleteSeaTrial(trialId: number): Promise<void> {
  const response = await fetch(`${ENDPOINT}/${trialId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete sea trial ${trialId}: ${response.statusText}`,
    );
  }
}

/**
 * Get comprehensive analysis for a sea trial
 */
export async function getSeaTrialAnalysis(
  trialId: number,
): Promise<SeaTrialAnalysis> {
  const response = await fetch(`${ENDPOINT}/${trialId}/analysis`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sea trial analysis: ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Get summary statistics for all sea trials
 */
export async function getSeaTrialsSummary(): Promise<SeaTrialSummary> {
  const response = await fetch(`${ENDPOINT}/summary`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sea trials summary: ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Run the integrated XGBoost ML model on a sea trial to predict shaft power.
 * Optionally saves the result to the trial's predicted_power field.
 *
 * @param trialId  - Sea trial to run prediction on
 * @param token    - Supabase JWT auth token (passed in Authorization header)
 * @param updateTrial - Whether to persist result to trial (default: true)
 */
export async function runMLPrediction(
  trialId: number,
  token: string,
  updateTrial: boolean = true,
): Promise<MLPredictionResult> {
  const params = new URLSearchParams({
    update_trial: updateTrial.toString(),
  });

  const response = await fetch(
    `${ENDPOINT}/${trialId}/ml-predict?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }));
    throw new Error(
      error?.detail || `ML prediction failed: ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Helper function to format trial date for display
 */
export function formatTrialDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Helper function to get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400";
    case "in_progress":
      return "bg-blue-500/20 text-blue-400";
    case "planned":
      return "bg-zinc-500/20 text-zinc-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-zinc-500/20 text-zinc-400";
  }
}

/**
 * Helper function to get performance status color
 */
export function getPerformanceColor(status: string): string {
  switch (status) {
    case "better":
      return "text-green-400";
    case "within_tolerance":
    case "acceptable":
      return "text-blue-400";
    case "worse":
    case "needs_attention":
      return "text-orange-400";
    default:
      return "text-zinc-400";
  }
}

/**
 * Helper function to format deviation percentage
 */
export function formatDeviation(deviation?: number): string {
  if (deviation === undefined || deviation === null) {
    return "N/A";
  }

  const sign = deviation > 0 ? "+" : "";
  return `${sign}${deviation.toFixed(2)}%`;
}
