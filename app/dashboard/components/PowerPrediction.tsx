/**
 * Power Prediction Component
 * Provides ML-based vessel propulsion power prediction UI
 * with prediction form and history view
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  predictPower,
  getPredictionHistory,
  getPredictionStats,
  deletePrediction,
  deleteAllPredictions,
  formatPredictionDate,
} from "@/lib/services/predictionService";
import type {
  VesselFeatures,
  PowerPredictionResponse,
  PredictionHistoryItem,
  PredictionStatsResponse,
} from "@/lib/types/prediction.types";

// ─── Features info modal ───────────────────────────────────────────────────────
const RAW_FEATURES = [
  { name: "draft_aft_telegram", desc: "Aft draft from telegram", unit: "m" },
  { name: "draft_fore_telegram", desc: "Fore draft from telegram", unit: "m" },
  { name: "stw", desc: "Speed through water", unit: "kn" },
  {
    name: "diff_speed_overground",
    desc: "Difference between STW and SOG (current effect proxy)",
    unit: "kn",
  },
  {
    name: "awind_vcomp_provider",
    desc: "Apparent wind — north/south component",
    unit: "m/s",
  },
  {
    name: "awind_ucomp_provider",
    desc: "Apparent wind — east/west component",
    unit: "m/s",
  },
  {
    name: "rcurrent_vcomp",
    desc: "Residual current — north/south component",
    unit: "m/s",
  },
  {
    name: "rcurrent_ucomp",
    desc: "Residual current — east/west component",
    unit: "m/s",
  },
  {
    name: "comb_wind_swell_wave_height",
    desc: "Combined wind & swell wave height",
    unit: "m",
  },
  {
    name: "timeSinceDryDock",
    desc: "Days elapsed since last dry dock (hull fouling proxy)",
    unit: "days",
  },
];

const DERIVED_FEATURES = [
  {
    name: "stw_cubed",
    desc: "STW³ — captures cubic propulsion resistance",
    formula: "stw³",
  },
  {
    name: "stw_squared",
    desc: "STW² — quadratic drag component",
    formula: "stw²",
  },
  {
    name: "mean_draft",
    desc: "Average of aft and fore drafts",
    formula: "(aft + fore) / 2",
  },
  {
    name: "trim",
    desc: "Longitudinal inclination of the vessel",
    formula: "aft − fore",
  },
  {
    name: "wind_magnitude",
    desc: "Total apparent wind speed",
    formula: "√(u² + v²)",
  },
  {
    name: "wind_angle",
    desc: "Apparent wind direction",
    formula: "atan2(v, u)",
  },
  {
    name: "current_magnitude",
    desc: "Total residual current speed",
    formula: "√(u² + v²)",
  },
  {
    name: "current_angle",
    desc: "Residual current direction",
    formula: "atan2(v, u)",
  },
  {
    name: "speed_wind_interaction",
    desc: "Interaction term between STW and wind speed",
    formula: "stw × wind_magnitude",
  },
];

function FeaturesInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
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
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Prediction Features
              </h2>
              <p className="text-xs text-zinc-500">
                19 total · 10 raw inputs · 9 derived
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6 custom-scrollbar">
          {/* Raw inputs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Raw Inputs
              </span>
              <span className="text-xs text-zinc-600">— provided by you</span>
              <span className="ml-auto text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                10 features
              </span>
            </div>
            <div className="space-y-1.5">
              {RAW_FEATURES.map((f, i) => (
                <div
                  key={f.name}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/70 transition-colors"
                >
                  <span className="text-xs font-mono text-zinc-600 w-5 text-right shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono text-blue-300">
                      {f.name}
                    </code>
                    <p className="text-xs text-zinc-400 mt-0.5">{f.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 shrink-0 mt-0.5">
                    {f.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Derived features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Derived Features
              </span>
              <span className="text-xs text-zinc-600">
                — computed automatically
              </span>
              <span className="ml-auto text-xs bg-emerald-600/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                9 features
              </span>
            </div>
            <div className="space-y-1.5">
              {DERIVED_FEATURES.map((f, i) => (
                <div
                  key={f.name}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/70 transition-colors"
                >
                  <span className="text-xs font-mono text-zinc-600 w-5 text-right shrink-0 mt-0.5">
                    {i + 11}
                  </span>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono text-emerald-300">
                      {f.name}
                    </code>
                    <p className="text-xs text-zinc-400 mt-0.5">{f.desc}</p>
                  </div>
                  <code className="text-xs font-mono text-zinc-500 shrink-0 mt-0.5">
                    {f.formula}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            Model: XGBoost · R² 0.978 · MAE ±866 kW
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors border border-zinc-700/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Default form values ──────────────────────────────────────────────────────
const DEFAULT_FEATURES: VesselFeatures = {
  draft_aft_telegram: 8.75,
  draft_fore_telegram: 8.55,
  stw: 18.2,
  diff_speed_overground: 0.1,
  awind_vcomp_provider: 5.2,
  awind_ucomp_provider: 3.1,
  rcurrent_vcomp: 0.05,
  rcurrent_ucomp: -0.08,
  comb_wind_swell_wave_height: 1.2,
  timeSinceDryDock: 120,
};

// ─── Field metadata for rendering ─────────────────────────────────────────────
interface FieldMeta {
  key: keyof VesselFeatures;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  tooltip: string;
}

const VESSEL_FIELDS: FieldMeta[] = [
  {
    key: "draft_aft_telegram",
    label: "Aft Draft",
    unit: "m",
    min: 0,
    max: 20,
    step: 0.01,
    tooltip: "Aft draft from telegram (meters)",
  },
  {
    key: "draft_fore_telegram",
    label: "Fore Draft",
    unit: "m",
    min: 0,
    max: 20,
    step: 0.01,
    tooltip: "Forward draft from telegram (meters)",
  },
  {
    key: "stw",
    label: "Speed Through Water",
    unit: "kn",
    min: 0,
    max: 40,
    step: 0.1,
    tooltip: "Speed through water in knots",
  },
  {
    key: "diff_speed_overground",
    label: "SOG-STW Diff",
    unit: "kn",
    min: -10,
    max: 10,
    step: 0.01,
    tooltip: "Difference between speed over ground and speed through water",
  },
];

const WIND_FIELDS: FieldMeta[] = [
  {
    key: "awind_vcomp_provider",
    label: "Apparent Wind V",
    unit: "m/s",
    min: -50,
    max: 50,
    step: 0.1,
    tooltip: "Apparent wind V component (North-South) in m/s",
  },
  {
    key: "awind_ucomp_provider",
    label: "Apparent Wind U",
    unit: "m/s",
    min: -50,
    max: 50,
    step: 0.1,
    tooltip: "Apparent wind U component (East-West) in m/s",
  },
];

const CURRENT_FIELDS: FieldMeta[] = [
  {
    key: "rcurrent_vcomp",
    label: "Current V",
    unit: "m/s",
    min: -10,
    max: 10,
    step: 0.01,
    tooltip: "Ocean current V component (North-South) in m/s",
  },
  {
    key: "rcurrent_ucomp",
    label: "Current U",
    unit: "m/s",
    min: -10,
    max: 10,
    step: 0.01,
    tooltip: "Ocean current U component (East-West) in m/s",
  },
];

const ENV_FIELDS: FieldMeta[] = [
  {
    key: "comb_wind_swell_wave_height",
    label: "Wave Height",
    unit: "m",
    min: 0,
    max: 20,
    step: 0.1,
    tooltip: "Combined wind and swell wave height in meters",
  },
  {
    key: "timeSinceDryDock",
    label: "Days Since Dry Dock",
    unit: "days",
    min: 0,
    max: 3650,
    step: 1,
    tooltip: "Number of days since the last dry dock maintenance",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  meta,
  value,
  onChange,
}: {
  meta: FieldMeta;
  value: number;
  onChange: (key: keyof VesselFeatures, value: number) => void;
}) {
  const step = meta.step ?? 1;

  const increment = () => {
    const next = parseFloat((value + step).toFixed(10));
    if (meta.max === undefined || next <= meta.max) onChange(meta.key, next);
  };

  const decrement = () => {
    const next = parseFloat((value - step).toFixed(10));
    if (meta.min === undefined || next >= meta.min) onChange(meta.key, next);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400 flex items-center gap-1">
        {meta.label}
        <span className="text-zinc-600">({meta.unit})</span>
      </label>
      <div className="flex rounded-md overflow-hidden border border-zinc-700/50 focus-within:border-blue-500/60 transition-colors bg-zinc-800/60">
        <input
          type="number"
          value={value}
          min={meta.min}
          max={meta.max}
          step={step}
          onChange={(e) => onChange(meta.key, parseFloat(e.target.value) || 0)}
          title={meta.tooltip}
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
        <div className="flex flex-col border-l border-zinc-700/50">
          <button
            type="button"
            onClick={increment}
            className="flex-1 px-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-colors border-b border-zinc-700/50 leading-none"
            tabIndex={-1}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor">
              <path d="M4 0L8 6H0L4 0Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={decrement}
            className="flex-1 px-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-colors leading-none"
            tabIndex={-1}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor">
              <path d="M4 6L0 0H8L4 6Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({
  title,
  icon,
  fields,
  values,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  fields: FieldMeta[];
  values: VesselFeatures;
  onChange: (key: keyof VesselFeatures, value: number) => void;
}) {
  return (
    <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/40 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-blue-400">{icon}</span>
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <InputField
            key={field.key}
            meta={field}
            value={values[field.key]}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Result Banner (full-width, prominent) ───────────────────────────────────
function ResultBanner({
  result,
  features,
}: {
  result: PowerPredictionResponse;
  features: VesselFeatures;
}) {
  const MAX_KW = 35000;
  const pct = Math.min((result.predicted_power_kw / MAX_KW) * 100, 100);

  const zone = pct < 40 ? "Efficient" : pct < 65 ? "Moderate" : "High Load";
  const zoneStyle =
    zone === "Efficient"
      ? {
          badge: "bg-green-500/15 border-green-500/30 text-green-400",
          bar: "#22c55e",
          dot: "bg-green-400",
        }
      : zone === "Moderate"
        ? {
            badge: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
            bar: "#eab308",
            dot: "bg-yellow-400",
          }
        : {
            badge: "bg-orange-500/15 border-orange-500/30 text-orange-400",
            bar: "#f97316",
            dot: "bg-orange-400",
          };

  return (
    <div className="rounded-xl border border-blue-500/20 bg-zinc-900/80 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-500">
      {/* Accent top bar */}
      <div className="h-0.5 bg-linear-to-r from-blue-600 via-blue-400/50 to-transparent" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-center">
          {/* ── Col 1: Big power number ──────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-3">
              <svg
                className="w-3.5 h-3.5 text-blue-400"
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
              Predicted Power Output
            </div>
            <div className="tabular-nums leading-none">
              <span className="text-6xl font-bold text-white">
                {result.predicted_power_kw.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-2xl text-zinc-500 ml-2 font-light">kW</span>
            </div>
            <div className="text-lg text-zinc-500 pt-1">
              <span className="text-blue-400 font-semibold text-xl">
                {result.predicted_power_mw.toFixed(2)}
              </span>
              <span className="ml-1.5 text-zinc-600">MW</span>
            </div>
          </div>

          {/* ── Col 2: Power range bar + input summary ───────────────── */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
                <span>0 kW</span>
                <span className="text-zinc-400 font-medium">Output Range</span>
                <span>35,000 kW</span>
              </div>
              <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, #3b82f6, ${zoneStyle.bar})`,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/30 rounded-full transition-all duration-700"
                  style={{ left: `${Math.min(pct, 99)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-zinc-600">Efficient</span>
                <span className="text-zinc-500">{pct.toFixed(1)}% of max</span>
                <span className="text-zinc-600">High Load</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-600 mb-1.5 uppercase tracking-wide">
                Key Inputs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { l: "STW", v: `${features.stw} kn` },
                  { l: "Draft Aft", v: `${features.draft_aft_telegram} m` },
                  { l: "Fore Draft", v: `${features.draft_fore_telegram} m` },
                  {
                    l: "Waves",
                    v: `${features.comb_wind_swell_wave_height} m`,
                  },
                  { l: "Dry Dock", v: `${features.timeSinceDryDock}d` },
                ].map((c) => (
                  <span
                    key={c.l}
                    className="text-xs bg-zinc-800/80 border border-zinc-700/40 px-2 py-0.5 rounded text-zinc-500"
                  >
                    {c.l}: <span className="text-zinc-300">{c.v}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3: Efficiency badge + metrics ───────────────────── */}
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${zoneStyle.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${zoneStyle.dot}`} />
              {zone}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "R² Score", value: "0.978", color: "text-green-400" },
                { label: "MAE", value: "±866 kW", color: "text-blue-400" },
                {
                  label: "Model",
                  value: result.model_used.toUpperCase(),
                  color: "text-zinc-300",
                },
                {
                  label: "Record",
                  value: result.id ? `#${result.id}` : "Not saved",
                  color: "text-zinc-400",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-zinc-800/50 rounded-lg p-2.5 border border-zinc-700/30"
                >
                  <div className="text-xs text-zinc-500 mb-0.5">{m.label}</div>
                  <div className={`text-sm font-semibold ${m.color}`}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ stats }: { stats: PredictionStatsResponse }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {[
        {
          label: "Total",
          value: stats.total_predictions,
          color: "text-white",
        },
        {
          label: "This Month",
          value: stats.predictions_this_month,
          color: "text-blue-400",
        },
        {
          label: "Avg Power",
          value: `${(stats.avg_power_kw / 1000).toFixed(1)} MW`,
          color: "text-zinc-300",
        },
        {
          label: "Max Power",
          value: `${(stats.max_power_kw / 1000).toFixed(1)} MW`,
          color: "text-orange-400",
        },
        {
          label: "Min Power",
          value: `${(stats.min_power_kw / 1000).toFixed(1)} MW`,
          color: "text-green-400",
        },
        {
          label: "Last Run",
          value: stats.most_recent
            ? new Date(stats.most_recent).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "—",
          color: "text-zinc-400",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-3 text-center"
        >
          <div className="text-xs text-zinc-500 mb-1">{s.label}</div>
          <div className={`text-base font-semibold ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── History Table ────────────────────────────────────────────────────────────
function HistoryTable({
  items,
  onDelete,
}: {
  items: PredictionHistoryItem[];
  onDelete: (id: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-zinc-800/50 rounded-xl flex items-center justify-center mb-4 border border-zinc-700/40">
          <svg
            className="w-7 h-7 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">No predictions yet</p>
        <p className="text-zinc-600 text-xs mt-1">
          Run your first prediction to see history here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {[
              "#",
              "Date",
              "Power (kW)",
              "Power (MW)",
              "STW (kn)",
              "Draft Aft",
              "Wave Ht",
              "Model",
              "",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-zinc-800/20 transition-colors group"
            >
              <td className="px-4 py-3 text-zinc-500 text-xs">#{item.id}</td>
              <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                {formatPredictionDate(item.created_at)}
              </td>
              <td className="px-4 py-3 font-medium text-white">
                {item.predicted_power_kw.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </td>
              <td className="px-4 py-3 text-blue-400 font-medium">
                {item.predicted_power_mw.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {item.stw?.toFixed(1) ?? "—"}
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {item.draft_aft_telegram?.toFixed(2) ?? "—"} m
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {item.comb_wind_swell_wave_height?.toFixed(1) ?? "—"} m
              </td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                  {item.model_used}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400"
                  title="Delete prediction"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PowerPrediction() {
  const [activeTab, setActiveTab] = useState<"predict" | "history">("predict");
  const [features, setFeatures] = useState<VesselFeatures>(DEFAULT_FEATURES);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PowerPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // History state
  const [historyItems, setHistoryItems] = useState<PredictionHistoryItem[]>([]);
  const [stats, setStats] = useState<PredictionStatsResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const PAGE_SIZE = 15;

  // ── Auth token helper ─────────────────────────────────────────────────────
  const getToken = useCallback(async (): Promise<string> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");
    return session.access_token;
  }, []);

  // ── Load history ──────────────────────────────────────────────────────────
  const loadHistory = useCallback(
    async (page = 1) => {
      setHistoryLoading(true);
      try {
        const token = await getToken();
        const [histData, statsData] = await Promise.all([
          getPredictionHistory(token, page, PAGE_SIZE),
          getPredictionStats(token),
        ]);
        setHistoryItems(histData.predictions);
        setHistoryTotal(histData.total);
        setStats(statsData);
        setHistoryPage(page);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setHistoryLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory(1);
    }
  }, [activeTab, loadHistory]);

  // ── Form change ───────────────────────────────────────────────────────────
  const handleFieldChange = (key: keyof VesselFeatures, value: number) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  // ── Submit prediction ─────────────────────────────────────────────────────
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = await getToken();
      const res = await predictPower(
        { features, save_to_history: saveToHistory },
        token,
      );
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete single prediction ──────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      const token = await getToken();
      await deletePrediction(id, token);
      setHistoryItems((prev) => prev.filter((p) => p.id !== id));
      setHistoryTotal((t) => t - 1);
      if (stats) {
        setStats((s) =>
          s ? { ...s, total_predictions: s.total_predictions - 1 } : s,
        );
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ── Delete all ────────────────────────────────────────────────────────────
  const handleDeleteAll = async () => {
    try {
      const token = await getToken();
      await deleteAllPredictions(token);
      setHistoryItems([]);
      setHistoryTotal(0);
      setStats(null);
      setDeleteAllConfirm(false);
    } catch (err) {
      console.error("Delete all failed:", err);
    }
  };

  // ── Reset form ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setFeatures(DEFAULT_FEATURES);
    setResult(null);
    setError(null);
  };

  const totalPages = Math.ceil(historyTotal / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Power Prediction</h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              XGBoost · R² 0.978 · MAE ±866 kW
            </p>
          </div>
          <button
            onClick={() => setShowFeaturesModal(true)}
            title="View prediction features"
            className="mt-0.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 hover:bg-zinc-700/60 hover:border-zinc-600/60 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all"
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            19 Features
          </button>
        </div>
        {showFeaturesModal && (
          <FeaturesInfoModal onClose={() => setShowFeaturesModal(false)} />
        )}
        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/40">
          <button
            onClick={() => setActiveTab("predict")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "predict"
                ? "bg-blue-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
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
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              History
            </span>
          </button>
        </div>
      </div>

      {/* ── Prediction Tab ─────────────────────────────────────────────────── */}
      {activeTab === "predict" && (
        <div className="space-y-5">
          {/* Full-width result banner — appears when prediction is ready */}
          {result && <ResultBanner result={result} features={features} />}

          {/* Error banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-5 py-4 text-sm text-red-400 flex items-start gap-3">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
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
            </div>
          )}

          {/* Form + Model Info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Form — 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              {/* Vessel Parameters */}
              <FieldGroup
                title="Vessel Parameters"
                icon={
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                fields={VESSEL_FIELDS}
                values={features}
                onChange={handleFieldChange}
              />

              {/* Wind */}
              <FieldGroup
                title="Wind Conditions"
                icon={
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                }
                fields={WIND_FIELDS}
                values={features}
                onChange={handleFieldChange}
              />

              {/* Current */}
              <FieldGroup
                title="Ocean Current"
                icon={
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
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                }
                fields={CURRENT_FIELDS}
                values={features}
                onChange={handleFieldChange}
              />

              {/* Environment */}
              <FieldGroup
                title="Environment & Maintenance"
                icon={
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
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                }
                fields={ENV_FIELDS}
                values={features}
                onChange={handleFieldChange}
              />

              {/* Save toggle + Actions */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setSaveToHistory(!saveToHistory)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      saveToHistory ? "bg-blue-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        saveToHistory ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-zinc-400">Save to history</span>
                </label>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePredict}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-30"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
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
                        Predicting…
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
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
                        Predict Power
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Model info + idle hint — 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Model info card */}
              <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
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
                      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                    />
                  </svg>
                  Active Model
                </h3>
                <div className="space-y-1.5 text-xs">
                  {[
                    ["Model", "XGBoost"],
                    ["Input Features", "10 vessel parameters"],
                    ["R² Score (in-dev)", "0.978"],
                    ["R² Score (out-dev)", "0.906"],
                    ["MAE (in-dev)", "±866 kW"],
                    ["MAE (out-dev)", "±1,435 kW"],
                    ["Model Size", "993 KB"],
                    ["Status", "Production Ready"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-zinc-500">{k}</span>
                      <span className="text-zinc-300 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idle placeholder — only when no result and no error */}
              {!result && !error && !loading && (
                <div className="bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700/60 p-10 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-zinc-800/60 rounded-xl flex items-center justify-center border border-zinc-700/40">
                    <svg
                      className="w-6 h-6 text-zinc-500"
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
                  </div>
                  <p className="text-zinc-500 text-sm">
                    Fill in vessel parameters and click{" "}
                    <span className="text-blue-400">Predict Power</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── History Tab ────────────────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Stats */}
          {stats && <StatsBar stats={stats} />}

          {/* History table card */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Prediction History
                {historyTotal > 0 && (
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({historyTotal} total)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadHistory(historyPage)}
                  disabled={historyLoading}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <svg
                    className={`w-3.5 h-3.5 mr-1 ${historyLoading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </Button>
                {historyItems.length > 0 &&
                  (!deleteAllConfirm ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteAllConfirm(true)}
                      className="border-red-800/50 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      Clear All
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-red-400 mr-1">
                        Are you sure?
                      </span>
                      <Button
                        size="sm"
                        onClick={handleDeleteAll}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 px-2"
                      >
                        Yes, delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteAllConfirm(false)}
                        className="border-zinc-700 text-zinc-400 text-xs h-7 px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-16 text-zinc-400 text-sm gap-2">
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
                Loading history…
              </div>
            ) : (
              <HistoryTable items={historyItems} onDelete={handleDelete} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Page {historyPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage <= 1 || historyLoading}
                    onClick={() => loadHistory(historyPage - 1)}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 h-7 w-7 p-0"
                  >
                    ‹
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => loadHistory(page)}
                        className={`h-7 w-7 p-0 text-xs ${
                          historyPage === page
                            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                            : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={historyPage >= totalPages || historyLoading}
                    onClick={() => loadHistory(historyPage + 1)}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 h-7 w-7 p-0"
                  >
                    ›
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
