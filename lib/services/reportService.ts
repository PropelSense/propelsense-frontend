import { API_BASE_URL } from "@/lib/constants/app";
import type {
  ReportItem,
  ReportListResponse,
  GenerateReportRequest,
} from "@/lib/types/report.types";

const BASE = (API_BASE_URL || "http://localhost:8000") + "/api/v1/reports";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listReports(token: string): Promise<ReportListResponse> {
  const res = await fetch(BASE + "/", { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function generateReport(
  req: GenerateReportRequest,
  token: string,
): Promise<ReportItem> {
  const res = await fetch(BASE + "/generate", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(req),
  });
  return handleResponse(res);
}

export async function downloadReport(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function deleteReport(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) throw new Error("Delete failed");
}

export function formatReportDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
