/**
 * ML Power Prediction Service
 * API client for vessel propulsion power prediction
 */
import { API_BASE_URL } from "@/lib/constants/app";
import type {
  PowerPredictionRequest,
  PowerPredictionResponse,
  PredictionHistoryListResponse,
  PredictionStatsResponse,
} from "@/lib/types/prediction.types";

const BASE_URL = API_BASE_URL || "http://localhost:8000";
const ENDPOINT = `${BASE_URL}/api/v1/ml`;

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Predict vessel propulsion power
 */
export async function predictPower(
  request: PowerPredictionRequest,
  token: string,
): Promise<PowerPredictionResponse> {
  const response = await fetch(`${ENDPOINT}/predict/power`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail || `Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get paginated prediction history
 */
export async function getPredictionHistory(
  token: string,
  page = 1,
  pageSize = 20,
): Promise<PredictionHistoryListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort_by: "created_at",
    sort_desc: "true",
  });

  const response = await fetch(`${ENDPOINT}/history?${params}`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get prediction stats summary
 */
export async function getPredictionStats(
  token: string,
): Promise<PredictionStatsResponse> {
  const response = await fetch(`${ENDPOINT}/history/stats/summary`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a specific prediction
 */
export async function deletePrediction(
  id: number,
  token: string,
): Promise<void> {
  const response = await fetch(`${ENDPOINT}/history/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete prediction: ${response.statusText}`);
  }
}

/**
 * Delete all predictions for the current user
 */
export async function deleteAllPredictions(token: string): Promise<number> {
  const response = await fetch(`${ENDPOINT}/history`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete predictions: ${response.statusText}`);
  }

  const data = await response.json();
  return data.count ?? 0;
}

/**
 * Format a date string for display
 */
export function formatPredictionDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
