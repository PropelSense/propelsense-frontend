"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  listReports,
  generateReport,
  downloadReport,
  deleteReport,
  formatReportDate,
} from "@/lib/services/reportService";
import type { ReportItem } from "@/lib/types/report.types";

// ─── Report type definitions ───────────────────────────────────────────────────
const REPORT_TYPES = [
  {
    id: "prediction_summary" as const,
    title: "Power Prediction Summary",
    desc: "A PDF of your full prediction history, stats overview (total runs, average / max / min power) plus a detailed table of every prediction with inputs and results.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    accent: "blue" as const,
  },
  {
    id: "sea_trial_summary" as const,
    title: "Sea Trial Performance Report",
    desc: "A PDF summary of all sea trial records, completion stats, average actual vs predicted power, and a full trial-by-trial table with conditions and performance metrics.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6"
        />
      </svg>
    ),
    accent: "cyan" as const,
  },
] as const;

const ACCENT: Record<string, { card: string; icon: string; btn: string }> = {
  blue: {
    card: "border-blue-500/20 hover:border-blue-500/40",
    icon: "bg-blue-600/15 border-blue-500/25 text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  cyan: {
    card: "border-cyan-500/20 hover:border-cyan-500/40",
    icon: "bg-cyan-600/15 border-cyan-500/25 text-cyan-400",
    btn: "bg-cyan-700 hover:bg-cyan-600 text-white",
  },
};

const TYPE_LABEL: Record<string, string> = {
  prediction_summary: "Prediction Summary",
  sea_trial_summary: "Sea Trial Summary",
};

// ─── Main component ────────────────────────────────────────────────────────────
export default function Reports() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(async (): Promise<string> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    return session.access_token;
  }, []);

  const load = useCallback(async () => {
    try {
      const token = await getToken();
      const data = await listReports(token);
      setReports(data.reports);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async (
    type: "prediction_summary" | "sea_trial_summary",
  ) => {
    setGenerating(type);
    setError(null);
    try {
      const token = await getToken();
      await generateReport({ report_type: type }, token);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = async (id: number) => {
    setDownloading(id);
    try {
      const token = await getToken();
      await downloadReport(id, token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await getToken();
      await deleteReport(id, token);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Generate and download PDF reports for predictions and sea trials
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-500/30 bg-red-600/10 text-red-300 text-sm">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Generate section */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
          Generate Report
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {REPORT_TYPES.map((rt) => {
            const a = ACCENT[rt.accent];
            const isGenerating = generating === rt.id;
            return (
              <div
                key={rt.id}
                className={`rounded-xl border bg-zinc-900/60 p-5 flex flex-col gap-4 transition-colors ${a.card}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${a.icon}`}
                  >
                    {rt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">
                      {rt.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {rt.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerate(rt.id)}
                  disabled={!!generating}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${a.btn}`}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Saved Reports
          </h2>
          <span className="text-xs text-zinc-600">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-zinc-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">No reports yet.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Generate one above to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 w-48">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 w-44">
                    Created
                  </th>
                  <th className="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <svg
                          className="w-4 h-4 text-zinc-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-zinc-200 text-sm font-medium">
                          {r.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium whitespace-nowrap
                        ${
                          r.report_type === "prediction_summary"
                            ? "bg-blue-600/15 text-blue-300 border-blue-500/20"
                            : "bg-cyan-600/15 text-cyan-300 border-cyan-500/20"
                        }`}
                      >
                        {TYPE_LABEL[r.report_type] ?? r.report_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {formatReportDate(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Download */}
                        <button
                          onClick={() => handleDownload(r.id)}
                          disabled={downloading === r.id}
                          title="Download PDF"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs transition-colors disabled:opacity-50"
                        >
                          {downloading === r.id ? (
                            <svg
                              className="w-3.5 h-3.5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          )}
                          PDF
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Delete report"
                          className="p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
