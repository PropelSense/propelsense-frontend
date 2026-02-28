"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import {
  getPredictionHistory,
  getPredictionStats,
} from "@/lib/services/predictionService";
import type {
  PredictionHistoryItem,
  PredictionStatsResponse,
} from "@/lib/types/prediction.types";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";

interface SeaTrialSummary {
  total_trials: number;
  completed_trials: number;
  trials_meeting_contract: number;
  avg_performance_score?: number;
  avg_speed_deviation?: number;
  avg_power_deviation?: number;
}

interface ModuleCard {
  id: string;
  label: string;
  desc: string;
  accent: string;
  icon: React.ReactNode;
}

const MODULES: ModuleCard[] = [
  {
    id: "new-prediction",
    label: "Power Prediction",
    desc: "Run an ML-based propulsion power estimate",
    accent: "blue",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: "sea-trials",
    label: "Sea Trials",
    desc: "Browse performance trial records",
    accent: "cyan",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6"
        />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Ocean Analytics",
    desc: "Live wave, swell, and current data",
    accent: "violet",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "vessel-traffic",
    label: "Vessel Traffic",
    desc: "Live AIS vessel positions on map",
    accent: "emerald",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    id: "weather",
    label: "Weather Details",
    desc: "Atmospheric forecast & wind data",
    accent: "amber",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    desc: "Generate and download PDF reports",
    accent: "rose",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

const ACCENT_STYLES: Record<
  string,
  { card: string; icon: string; dot: string }
> = {
  blue: {
    card: "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-600/5",
    icon: "bg-blue-600/15 border-blue-500/25 text-blue-400",
    dot: "bg-blue-500",
  },
  cyan: {
    card: "border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-600/5",
    icon: "bg-cyan-600/15 border-cyan-500/25 text-cyan-400",
    dot: "bg-cyan-500",
  },
  violet: {
    card: "border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-600/5",
    icon: "bg-violet-600/15 border-violet-500/25 text-violet-400",
    dot: "bg-violet-500",
  },
  emerald: {
    card: "border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-600/5",
    icon: "bg-emerald-600/15 border-emerald-500/25 text-emerald-400",
    dot: "bg-emerald-500",
  },
  amber: {
    card: "border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-600/5",
    icon: "bg-amber-600/15 border-amber-500/25 text-amber-400",
    dot: "bg-amber-500",
  },
  rose: {
    card: "border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-600/5",
    icon: "bg-rose-600/15 border-rose-500/25 text-rose-400",
    dot: "bg-rose-500",
  },
};

function StatTile({
  label,
  value,
  sub,
  accent = "blue",
  loading = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  loading?: boolean;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </p>
      {loading ? (
        <div className="h-7 w-20 bg-zinc-800 rounded animate-pulse mt-2" />
      ) : (
        <p
          className={`text-2xl font-bold mt-1 ${colors[accent] || colors.blue}`}
        >
          {value}
        </p>
      )}
      {sub && !loading && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function MainDashboard({
  userName,
  onNavigate,
}: {
  userName: string;
  onNavigate: (id: string) => void;
}) {
  const [predStats, setPredStats] = useState<PredictionStatsResponse | null>(
    null,
  );
  const [recentPreds, setRecentPreds] = useState<PredictionHistoryItem[]>([]);
  const [trialSummary, setTrialSummary] = useState<SeaTrialSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const token = await getToken();

      await Promise.allSettled([
        // Prediction stats (auth required)
        token
          ? getPredictionStats(token)
              .then(setPredStats)
              .catch(() => null)
          : Promise.resolve(),

        // Recent predictions (auth required)
        token
          ? getPredictionHistory(token, 1, 5)
              .then((d) => setRecentPreds(d.predictions))
              .catch(() => null)
          : Promise.resolve(),

        // Sea trial summary (no auth needed)
        fetch(`${API_BASE}/sea-trials/summary`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setTrialSummary(d))
          .catch(() => null),
      ]);

      setLoading(false);
    };

    load();
  }, [getToken]);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Welcome ──────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-zinc-500 text-sm mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-white">
            {userName ? `${userName}` : "Welcome back"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {now.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => onNavigate("new-prediction")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          New Prediction
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Predictions"
          value={predStats ? String(predStats.total_predictions) : "0"}
          sub="all time"
          accent="blue"
          loading={loading}
        />
        <StatTile
          label="Avg Power"
          value={
            predStats?.avg_power_kw
              ? `${(predStats.avg_power_kw / 1000).toFixed(1)} MW`
              : "—"
          }
          sub="across all runs"
          accent="violet"
          loading={loading}
        />
        <StatTile
          label="Sea Trials"
          value={trialSummary ? String(trialSummary.total_trials) : "0"}
          sub={trialSummary ? `${trialSummary.completed_trials} completed` : ""}
          accent="cyan"
          loading={loading}
        />
        <StatTile
          label="Contract Met"
          value={
            trialSummary ? String(trialSummary.trials_meeting_contract) : "0"
          }
          sub="trials within spec"
          accent="emerald"
          loading={loading}
        />
      </div>

      {/* ── Power trend chart ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">
              Prediction Power Trend
            </h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              Last {recentPreds.length} predictions · kW
            </p>
          </div>
          {predStats?.avg_power_kw && (
            <span className="text-xs text-zinc-500">
              Avg:{" "}
              <span className="text-blue-400 font-semibold">
                {(predStats.avg_power_kw / 1000).toFixed(2)} MW
              </span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="h-44 bg-zinc-800/40 rounded-lg animate-pulse" />
        ) : recentPreds.length < 2 ? (
          <div className="h-44 flex items-center justify-center">
            <p className="text-sm text-zinc-600">
              Run at least 2 predictions to see the trend
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={176}>
            <AreaChart
              data={[...recentPreds].reverse().map((p, i) => ({
                label: `#${i + 1}`,
                kw: Math.round(p.predicted_power_kw),
                mw: parseFloat((p.predicted_power_kw / 1000).toFixed(3)),
                time: new Date(p.created_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }))}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "#52525b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e4e4e7",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  value == null
                    ? "—"
                    : value >= 1000
                      ? `${(value / 1000).toFixed(2)} MW`
                      : `${value} kW`,
                  "Power",
                ]}
                labelStyle={{ color: "#71717a" }}
              />
              <Area
                type="monotone"
                dataKey="kw"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#powerGrad)"
                dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#60a5fa", r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Main grid: recent predictions + model info ─────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Predictions */}
        <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">
                Recent Predictions
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">Your last 5 runs</p>
            </div>
            <button
              onClick={() => onNavigate("new-prediction")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-zinc-800/60 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : recentPreds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mb-3">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">No predictions yet</p>
              <button
                onClick={() => onNavigate("new-prediction")}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300"
              >
                Make your first prediction →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {recentPreds.map((p) => {
                const pct = Math.min((p.predicted_power_kw / 35000) * 100, 100);
                const zone =
                  pct < 40
                    ? {
                        label: "Efficient",
                        color:
                          "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      }
                    : pct < 65
                      ? {
                          label: "Moderate",
                          color:
                            "text-amber-400 bg-amber-500/10 border-amber-500/20",
                        }
                      : {
                          label: "High Load",
                          color:
                            "text-orange-400 bg-orange-500/10 border-orange-500/20",
                        };
                const dt = new Date(p.created_at);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {p.predicted_power_kw >= 1000
                            ? `${(p.predicted_power_kw / 1000).toFixed(2)} MW`
                            : `${p.predicted_power_kw.toFixed(0)} kW`}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${zone.color}`}
                        >
                          {zone.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        STW {p.stw?.toFixed(1) ?? "—"} kn · Draft{" "}
                        {p.draft_aft_telegram?.toFixed(2) ?? "—"} /{" "}
                        {p.draft_fore_telegram?.toFixed(2) ?? "—"} m
                      </p>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">
                      {dt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      {dt.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: model card + sea trial snapshot */}
        <div className="lg:col-span-2 space-y-4">
          {/* ML Model card */}
          <div className="rounded-xl border border-blue-500/15 bg-linear-to-br from-blue-600/10 via-zinc-900/80 to-zinc-900 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  XGBoost Model
                </p>
                <p className="text-xs text-zinc-500">
                  Active · Production ready
                </p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["R² Score", "0.978"],
                ["MAE", "±866 kW"],
                ["Features", "19"],
                ["Size", "993 KB"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 px-3 py-2"
                >
                  <p className="text-xs text-zinc-600">{k}</p>
                  <p className="text-sm font-semibold text-zinc-200 mt-0.5">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sea trial snapshot */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                Sea Trial Snapshot
              </h2>
              <button
                onClick={() => onNavigate("sea-trials")}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Open →
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-zinc-800/60 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : trialSummary ? (
              <div className="space-y-3">
                {[
                  {
                    label: "Total Trials",
                    value: String(trialSummary.total_trials),
                  },
                  {
                    label: "Completed",
                    value: String(trialSummary.completed_trials),
                  },
                  {
                    label: "Avg Perf. Score",
                    value:
                      trialSummary.avg_performance_score != null
                        ? `${trialSummary.avg_performance_score.toFixed(1)}%`
                        : "—",
                  },
                  {
                    label: "Avg Power Dev.",
                    value:
                      trialSummary.avg_power_deviation != null
                        ? `${trialSummary.avg_power_deviation > 0 ? "+" : ""}${trialSummary.avg_power_deviation.toFixed(1)} kW`
                        : "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-500">{label}</span>
                    <span className="font-semibold text-zinc-200">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 text-center py-4">
                Could not load sea trial data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Module shortcuts ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-600 mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MODULES.map((m) => {
            const a = ACCENT_STYLES[m.accent];
            return (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border bg-zinc-900/60 transition-all text-center ${a.card}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${a.icon}`}
                >
                  {m.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200 leading-tight">
                    {m.label}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-tight hidden sm:block">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
