/**
 * Sea Trial Performance Dashboard
 * Displays sea trial data with performance comparisons and analysis
 */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AreaChart from "@/app/components/charts/AreaChart";
import BarComparisonChart from "@/app/components/charts/BarComparisonChart";
import {
  getSeaTrials,
  getSeaTrialAnalysis,
  getSeaTrialsSummary,
  runMLPrediction,
  formatTrialDate,
  getStatusColor,
  getPerformanceColor,
  formatDeviation,
} from "@/lib/services/seaTrialService";
import type {
  SeaTrial,
  SeaTrialAnalysis,
  SeaTrialSummary,
  TrialStatus,
  MLPredictionResult,
} from "@/lib/types/seaTrial.types";

export default function SeaTrialDashboard() {
  const [trials, setTrials] = useState<SeaTrial[]>([]);
  const [selectedTrial, setSelectedTrial] = useState<SeaTrial | null>(null);
  const [analysis, setAnalysis] = useState<SeaTrialAnalysis | null>(null);
  const [summary, setSummary] = useState<SeaTrialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TrialStatus | "all">("all");

  // ML prediction state
  const [mlLoading, setMlLoading] = useState(false);
  const [mlResult, setMlResult] = useState<MLPredictionResult | null>(null);
  const [mlError, setMlError] = useState<string | null>(null);

  // Fetch trials and summary on mount
  useEffect(() => {
    fetchTrialsAndSummary();
  }, [filterStatus]);

  const fetchTrialsAndSummary = async () => {
    try {
      setLoading(true);
      const [trialsData, summaryData] = await Promise.all([
        getSeaTrials({
          limit: 100,
          status: filterStatus !== "all" ? filterStatus : undefined,
        }),
        getSeaTrialsSummary(),
      ]);

      setTrials(trialsData);
      setSummary(summaryData);

      // Auto-select first trial if available
      if (trialsData.length > 0 && !selectedTrial) {
        await selectTrial(trialsData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch sea trials:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectTrial = async (trial: SeaTrial) => {
    setSelectedTrial(trial);
    setAnalysisLoading(true);
    // Clear previous ML result when switching trials
    setMlResult(null);
    setMlError(null);

    try {
      const analysisData = await getSeaTrialAnalysis(trial.sea_trial_id);
      setAnalysis(analysisData);
    } catch (error) {
      console.error("Failed to fetch trial analysis:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  /** Run the XGBoost ML model on the selected trial */
  const handleMLPredict = async () => {
    if (!selectedTrial) return;
    setMlLoading(true);
    setMlResult(null);
    setMlError(null);

    try {
      // Attempt to get a Supabase session token from localStorage
      let token = "";
      try {
        const raw =
          localStorage.getItem("sb-auth-token") ||
          Object.values(localStorage).find(
            (v) => typeof v === "string" && v.includes('"access_token"'),
          ) ||
          "";
        if (raw) {
          const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
          token = parsed?.access_token || parsed?.session?.access_token || "";
        }
      } catch {
        // token stays empty — backend may not require auth for this endpoint
      }

      const result = await runMLPrediction(
        selectedTrial.sea_trial_id,
        token,
        true,
      );
      setMlResult(result);

      // Refresh the trial analysis to show the updated predicted_power
      if (result.updated) {
        const updated = await getSeaTrialAnalysis(selectedTrial.sea_trial_id);
        setAnalysis(updated);
        // Also refresh the trial object in state so the list reflects the change
        setSelectedTrial((prev) =>
          prev ? { ...prev, predicted_power: result.predicted_power_kw } : prev,
        );
        setTrials((prev) =>
          prev.map((t) =>
            t.sea_trial_id === selectedTrial.sea_trial_id
              ? { ...t, predicted_power: result.predicted_power_kw }
              : t,
          ),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ML prediction failed";
      setMlError(msg);
    } finally {
      setMlLoading(false);
    }
  };

  // Prepare data for charts
  const getComparisonChartData = () => {
    if (!analysis) return [];

    return [
      {
        category: "Speed (knots)",
        value: analysis.speed_comparison.actual || 0,
        target: analysis.speed_comparison.predicted || 0,
      },
      {
        category: "Power (kW)",
        value: analysis.power_comparison.actual || 0,
        target: analysis.power_comparison.predicted || 0,
      },
      {
        category: "Fuel (t/day)",
        value: analysis.fuel_comparison.actual || 0,
        target: analysis.fuel_comparison.predicted || 0,
      },
      {
        category: "RPM",
        value: analysis.rpm_comparison.actual || 0,
        target: analysis.rpm_comparison.predicted || 0,
      },
    ];
  };

  const getDeviationChartData = () => {
    if (!analysis) return [];

    return [
      {
        category: "Speed",
        value: analysis.speed_comparison.deviation || 0,
        target: 0, // Zero line for reference
      },
      {
        category: "Power",
        value: analysis.power_comparison.deviation || 0,
        target: 0,
      },
      {
        category: "Fuel",
        value: analysis.fuel_comparison.deviation || 0,
        target: 0,
      },
      {
        category: "RPM",
        value: analysis.rpm_comparison.deviation || 0,
        target: 0,
      },
    ];
  };

  const getDeviationColor = (deviation?: number) => {
    if (!deviation) return "rgba(113, 113, 122, 0.5)";
    const abs = Math.abs(deviation);
    if (abs <= 2) return "rgba(34, 197, 94, 0.5)"; // green
    if (abs <= 5) return "rgba(59, 130, 246, 0.5)"; // blue
    return "rgba(251, 146, 60, 0.5)"; // orange
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-400">Loading sea trials...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Total Trials</div>
            <div className="text-3xl font-semibold text-white">
              {summary.total_trials}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Completed</div>
            <div className="text-3xl font-semibold text-green-400">
              {summary.completed_trials}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Avg Performance</div>
            <div className="text-3xl font-semibold text-blue-400">
              {summary.avg_performance_score?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Meeting Contract</div>
            <div className="text-3xl font-semibold text-purple-400">
              {summary.trials_meeting_contract}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trials List */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Sea Trials</h2>
              <div className="flex gap-2 mt-3">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className={`text-xs ${filterStatus === "all" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed" as TrialStatus)}
                  className={`text-xs ${filterStatus === "completed" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  Completed
                </Button>
                <Button
                  variant={
                    filterStatus === "in_progress" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("in_progress" as TrialStatus)}
                  className={`text-xs ${filterStatus === "in_progress" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  Active
                </Button>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {trials.length === 0 ? (
                <div className="p-6 text-center text-zinc-400">
                  No trials found
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {trials.map((trial) => (
                    <button
                      key={trial.sea_trial_id}
                      onClick={() => selectTrial(trial)}
                      className={`w-full text-left p-4 hover:bg-zinc-800/30 transition-colors ${
                        selectedTrial?.sea_trial_id === trial.sea_trial_id
                          ? "bg-zinc-800/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-white">
                          {trial.trial_name}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            trial.status,
                          )}`}
                        >
                          {trial.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-400">
                        {trial.vessel_name}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {formatTrialDate(trial.trial_date)}
                      </div>
                      {trial.overall_performance_score !== undefined && (
                        <div className="mt-2 text-xs">
                          <span className="text-zinc-400">Score: </span>
                          <span className="font-medium text-blue-400">
                            {trial.overall_performance_score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedTrial ? (
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-12 text-center text-zinc-400">
              Select a trial to view analysis
            </div>
          ) : analysisLoading ? (
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-12 text-center text-zinc-400">
              Loading analysis...
            </div>
          ) : analysis ? (
            <>
              {/* Trial Overview */}
              <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {analysis.trial_name}
                  </h2>
                  {/* ML Prediction button */}
                  <Button
                    onClick={handleMLPredict}
                    disabled={mlLoading}
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 flex items-center gap-2"
                    title="Use the XGBoost model to predict shaft power from this trial's conditions"
                  >
                    {mlLoading ? (
                      <>
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                        Predicting…
                      </>
                    ) : (
                      <>⚡ ML Predict Power</>
                    )}
                  </Button>
                </div>

                {/* ML result / error banner */}
                {mlResult && (
                  <div className="mb-4 rounded-lg border border-violet-700/50 bg-violet-950/40 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-violet-400 font-semibold text-sm">
                        ⚡ XGBoost ML Prediction
                      </span>
                      {mlResult.updated && (
                        <span className="text-xs bg-green-700/40 text-green-300 px-2 py-0.5 rounded">
                          Saved to trial
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-zinc-400">
                          Predicted Power
                        </div>
                        <div className="text-2xl font-bold text-violet-300">
                          {mlResult.predicted_power_kw.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          <span className="text-sm font-normal text-zinc-400">
                            kW
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {mlResult.predicted_power_mw.toFixed(3)} MW
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400 space-y-1">
                        {Object.entries(mlResult.features_used)
                          .filter(([, v]) => v !== 0)
                          .slice(0, 5)
                          .map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-zinc-500">
                                {k.replace(/_/g, " ")}
                              </span>
                              <span className="text-zinc-300 font-mono">
                                {(v as number).toFixed(3)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      {mlResult.message}
                    </p>
                  </div>
                )}
                {mlError && (
                  <div className="mb-4 rounded-lg border border-red-700/50 bg-red-950/40 p-3 text-sm text-red-400">
                    ⚠ {mlError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-zinc-400">Vessel</div>
                    <div className="font-medium text-white">
                      {analysis.vessel_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Date</div>
                    <div className="font-medium text-white">
                      {formatTrialDate(analysis.trial_date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">
                      Performance Score
                    </div>
                    <div className="text-2xl font-semibold text-blue-400">
                      {analysis.overall_performance_score.toFixed(1)}
                      <span className="text-sm text-zinc-400">/100</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">
                      Contract Compliance
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        analysis.meets_contract
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysis.meets_contract ? "✓ Met" : "✗ Not Met"}
                    </div>
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-sm text-zinc-400 mb-2">Summary</div>
                  <p className="text-zinc-300">{analysis.summary}</p>
                </div>
              </div>

              {/* Performance Comparison Chart */}
              <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Performance Comparison
                </h3>
                <BarComparisonChart
                  data={getComparisonChartData()}
                  valueName="Actual"
                  targetName="Predicted"
                  plain
                />
              </div>

              {/* Deviation Chart */}
              <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Deviation Analysis
                </h3>
                <BarComparisonChart
                  data={getDeviationChartData()}
                  valueName="Deviation"
                  targetName="Target (0%)"
                  plain
                />
              </div>

              {/* Detailed Metrics */}
              <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Detailed Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    analysis.speed_comparison,
                    analysis.power_comparison,
                    analysis.fuel_comparison,
                    analysis.rpm_comparison,
                  ].map((comp, idx) => (
                    <div
                      key={idx}
                      className="border border-zinc-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-white">
                          {comp.metric}
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded bg-zinc-800/50 ${getPerformanceColor(
                            comp.status,
                          )}`}
                        >
                          {comp.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-zinc-400">Predicted</div>
                          <div className="font-medium text-white">
                            {comp.predicted?.toFixed(2) || "N/A"} {comp.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-zinc-400">Actual</div>
                          <div className="font-medium text-white">
                            {comp.actual?.toFixed(2) || "N/A"} {comp.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-zinc-400">Deviation</div>
                          <div className="font-medium text-white">
                            {formatDeviation(comp.deviation)}
                          </div>
                        </div>
                        <div>
                          <div className="text-zinc-400">Absolute Diff</div>
                          <div className="font-medium text-white">
                            {comp.deviation_absolute?.toFixed(2) || "N/A"}{" "}
                            {comp.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-zinc-300"
                      >
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
